import prismaClient from "../../../../prisma";
import axios from "axios";

import { BlingTokenProvider } from "../../../../integrations/bling/BlingTokenProvider";

interface ImportRequest {
    empresa_id: string;
    bi_id: string;
    usuario_id: string;
    dataInicial?: string;
    dataFinal?: string;
}

class ImportLancamentosBlingService {
    async execute({ empresa_id, bi_id, dataInicial, dataFinal }: ImportRequest) {

        const [integracao, bi] = await Promise.all([
            prismaClient.blingIntegration.findUnique({ where: { empresaId: empresa_id } }),
            prismaClient.businessIntelligence.findFirst({ where: { id: bi_id } })
        ]);

        if (!integracao) throw new Error("Integração Bling não encontrada.");
        if (!bi) throw new Error("Nenhum Business Intelligence encontrado.");

        if (bi.empresa_id !== empresa_id) {
            throw new Error("O BI selecionado não pertence a esta empresa.");
        }

        const response = await axios.get("https://www.bling.com.br/Api/v3/caixas", {
            params: {
                dataInicial,
                dataFinal,
                limite: 100,
                situacao: 'R',
                situacaoConciliacao: 3
            },
            headers: { Authorization: `Bearer ${integracao.accessToken}` }
        });

        console.log("Status Bling:", response.status);
        console.log("Dados Brutos do Bling:", JSON.stringify(response.data, null, 2));

        const lancamentosBling = response.data.data || [];
        let importados = 0;
        let ignorados = 0;

        for (const lanc of lancamentosBling) {
            const idExternoBling = String(lanc.id);
            // No seu exemplo, "Fretes de vendas" vem aqui:
            const nomeCategoriaBling = lanc.descricao?.trim().toLowerCase();

            const existe = await prismaClient.lancamentoBi.findUnique({
                where: { id_externo_lancamento: idExternoBling }
            });

            if (existe) {
                ignorados++;
                continue;
            }

            let categoria_id: string | null = null;
            let subcategoria_id: string | null = null;

            // 1. Tenta buscar como Subcategoria (Match pelo Nome)
            const subNoBanco = await prismaClient.subCategoria.findFirst({
                where: {
                    empresaId: empresa_id,
                    name: nomeCategoriaBling
                }
            });

            if (subNoBanco) {
                subcategoria_id = subNoBanco.id;
                categoria_id = subNoBanco.categoria_id;
            } else {
                // 2. Se não achou sub, tenta buscar como Categoria Pai
                const catNoBanco = await prismaClient.categoria.findFirst({
                    where: {
                        empresaId: empresa_id,
                        name: { equals: nomeCategoriaBling }
                    }
                });
                if (catNoBanco) {
                    categoria_id = catNoBanco.id;
                }
            }

            if (!categoria_id) {
                console.warn(`Lançamento ${idExternoBling} ignorado: Categoria "${nomeCategoriaBling}" não encontrada.`);
                ignorados++;
                continue;
            }

            // 3. Criar o Lançamento
            await prismaClient.lancamentoBi.create({
                data: {
                    // Usamos Math.abs pois o Bling manda negativo para saídas (-17.22)
                    // e seu sistema provavelmente separa por Tipo (RECEITA/DESPESA)
                    valor: Math.abs(Number(lanc.valor)),
                    tipo: lanc.debCred === 'C' ? 'RECEITA' : 'DESPESA',
                    categoria_id: categoria_id,
                    subcategoria_id: subcategoria_id,
                    businessIntelligence_id: bi.id,
                    id_externo_lancamento: idExternoBling,
                }
            });

            importados++;
        }

        return {
            message: "Importação concluída!",
            stats: { total: lancamentosBling.length, importados, ignorados }
        };
    }
}

export { ImportLancamentosBlingService };