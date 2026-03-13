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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ImportLancamentosBlingService {
    async execute({ empresa_id, bi_id, dataInicial, dataFinal }: ImportRequest) {
        const tokenProvider = new BlingTokenProvider();
        const accessToken = await tokenProvider.getValidToken(empresa_id);

        const bi = await prismaClient.businessIntelligence.findUnique({
            where: { id: bi_id }
        });

        if (!bi) throw new Error("Nenhum BI encontrado.");
        if (bi.empresa_id !== empresa_id) {
            throw new Error("O BI selecionado não pertence a esta empresa.");
        }

        // Variáveis de controle de paginação e logs
        let pagina = 1;
        let continuarBuscando = true;
        const logsImportados = [];
        const logsIgnorados = [];

        while (continuarBuscando) {

            try {
                console.log(`Buscando página ${pagina} no Bling...`);

                const response = await axios.get("https://www.bling.com.br/Api/v3/caixas", {
                    params: {
                        pagina: pagina,
                        limite: 100, // Registros por página
                        dataInicial,
                        dataFinal,
                        situacao: 'R',
                        situacaoConciliacao: 1
                    },
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                const lancamentosBling = response.data.data || [];

                // Se a página vier vazia, interrompe o loop
                if (lancamentosBling.length === 0) {
                    continuarBuscando = false;
                    break;
                }

                for (const lanc of lancamentosBling) {
                    const idExternoBling = String(lanc.id);
                    const nomeCategoriaBling = lanc.descricao?.trim().toLowerCase();
                    const valorLancamento = Math.abs(Number(lanc.valor));

                    const infoItem = {
                        id: idExternoBling,
                        descricao: lanc.descricao,
                        valor: valorLancamento,
                        data: lanc.data
                    };

                    const existe = await prismaClient.lancamentoBi.findUnique({
                        where: { id_externo_lancamento: idExternoBling }
                    });

                    if (existe) {
                        logsIgnorados.push({ ...infoItem, motivo: "Já existe no banco" });
                        continue;
                    }

                    let categoria_id: string | null = null;
                    let subcategoria_id: string | null = null;

                    // Busca Categoria/Subcategoria
                    const subNoBanco = await prismaClient.subCategoria.findFirst({
                        where: { empresaId: empresa_id, name: nomeCategoriaBling }
                    });

                    if (subNoBanco) {
                        subcategoria_id = subNoBanco.id;
                        categoria_id = subNoBanco.categoria_id;
                    } else {
                        const catNoBanco = await prismaClient.categoria.findFirst({
                            where: { empresaId: empresa_id, name: { equals: nomeCategoriaBling } }
                        });
                        if (catNoBanco) {
                            categoria_id = catNoBanco.id;
                        }
                    }

                    if (!categoria_id) {
                        logsIgnorados.push({ ...infoItem, motivo: `Categoria "${lanc.descricao}" não mapeada` });
                        continue;
                    }

                    await prismaClient.lancamentoBi.create({
                        data: {
                            valor: valorLancamento,
                            tipo: lanc.debCred === 'C' ? 'RECEITA' : 'DESPESA',
                            categoria_id,
                            subcategoria_id,
                            businessIntelligence_id: bi.id,
                            id_externo_lancamento: idExternoBling,
                        }
                    });

                    logsImportados.push(infoItem);
                }

                if (lancamentosBling.length < 100) {
                    continuarBuscando = false;
                } else {
                    pagina++;
                    await sleep(500);
                }
            } catch (error) {
                if (error.response?.status === 429) {
                    console.warn("Rate limit atingido! Aguardando 2 segundos para tentar novamente...");
                    await sleep(2000);
                    continue;
                }

                console.error("Erro na busca do Bling:", error.message);
                throw error;
            }
        }

        return {
            message: "Importação completa!",
            stats: {
                paginas_percorridas: pagina,
                total_importados: logsImportados.length,
                total_ignorados: logsIgnorados.length
            },
            detalhes: {
                importados: logsImportados,
                ignorados: logsIgnorados
            }
        };
    }
}

export { ImportLancamentosBlingService };