import prismaClient from "../../../../prisma";
import axios from "axios";

import { BlingTokenProvider } from "../../../../integrations/bling/BlingTokenProvider";

class SyncCategoriasBlingService {
    async execute(empresa_id: string, usuario_id: string) {
        const integracao = await prismaClient.blingIntegration.findUnique({
            where: { empresaId: empresa_id }
        });

        if (!integracao) throw new Error("Integração não encontrada.");

        const buscarCategorias = async (tipo: number) => {
            const response = await axios.get("https://www.bling.com.br/Api/v3/categorias/receitas-despesas", {
                params: {
                    limite: 100,
                    situacao: 1,
                    tipo: tipo
                },
                headers: { Authorization: `Bearer ${integracao.accessToken}` }
            });
            return response.data.data || [];
        };

        // 1. Busca os dois tipos simultaneamente
        const [despesasBling, receitasBling] = await Promise.all([
            buscarCategorias(1),
            buscarCategorias(2)
        ]);

        const todasCategorias = [...despesasBling, ...receitasBling];

        // 2. Separar Pais e Filhos
        const pais = todasCategorias.filter(c => c.idCategoriaPai === 0);
        const filhos = todasCategorias.filter(c => c.idCategoriaPai !== 0);

        // --- PROCESSAR CATEGORIAS PAI ---
        for (const cat of pais) {
            const idExterno = String(cat.id);
            const nomeLimpo = cat.descricao.trim().toLowerCase();;
            // Mapeamento direto para o seu Enum TipoCategoria
            const tipoMapped = cat.tipo === 1 ? "DESPESA" : "RECEITA";

            let categoria = await prismaClient.categoria.findFirst({
                where: {
                    empresaId: empresa_id,
                    OR: [
                        { id_externo: idExterno },
                        { name: { equals: nomeLimpo } }
                    ]
                }
            });

            if (categoria) {
                await prismaClient.categoria.update({
                    where: { id: categoria.id },
                    data: {
                        id_externo: idExterno,
                        name: nomeLimpo,
                        tipo: tipoMapped as any,
                        origem: "BLING"
                    }
                });
            } else {
                await prismaClient.categoria.create({
                    data: {
                        name: nomeLimpo,
                        tipo: tipoMapped as any,
                        grupoDre: "NAO_EXIBIR_NO_DRE",
                        id_externo: idExterno,
                        origem: "BLING",
                        empresaId: empresa_id,
                        usuario_id: usuario_id
                    }
                });
            }
        }

        // --- PROCESSAR SUBCATEGORIAS ---
        for (const sub of filhos) {
            const nomeSub = sub.descricao.trim().toLowerCase();
            const idPaiBling = String(sub.idCategoriaPai);

            const categoriaPai = await prismaClient.categoria.findFirst({
                where: { empresaId: empresa_id, id_externo: idPaiBling }
            });

            if (!categoriaPai) continue;

            // Match de subcategoria pelo nome vinculado ao Pai encontrado
            const subExistente = await prismaClient.subCategoria.findFirst({
                where: {
                    categoria_id: categoriaPai.id,
                    name: { equals: nomeSub }
                }
            });

            if (!subExistente) {
                await prismaClient.subCategoria.create({
                    data: {
                        name: nomeSub,
                        categoria_id: categoriaPai.id,
                        empresaId: empresa_id,
                        origem: 'BLING'
                    }
                });
            }
        }

        return {
            message: "Sincronização concluída!",
            stats: { total: todasCategorias.length }
        };
    }
}

export { SyncCategoriasBlingService };