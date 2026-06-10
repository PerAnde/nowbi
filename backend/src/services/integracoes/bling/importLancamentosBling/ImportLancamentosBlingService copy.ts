import prismaClient from "../../../../prisma";
import axios from "axios";
import { BlingTokenProvider } from "../../../../integrations/bling/BlingTokenProvider";

interface ImportRequest {
    empresa_id: string;
    bi_id: string;
    usuario_id: string;
    dataInicial?: string;
    dataFinal?: string;
    contasIds?: string[];
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ImportLancamentosBlingService {
    async execute({ empresa_id, bi_id, dataInicial, dataFinal, contasIds }: ImportRequest) {
        const tokenProvider = new BlingTokenProvider();
        const accessToken = await tokenProvider.getValidToken(empresa_id);

        const bi = await prismaClient.businessIntelligence.findUnique({
            where: { id: bi_id }
        });

        if (!bi) throw new Error("Nenhum BI encontrado.");
        if (bi.empresa_id !== empresa_id) {
            throw new Error("O BI selecionado não pertence a esta empresa.");
        }

        const logsImportados = [];
        const logsIgnorados = [];

        // Se não vierem IDs, definimos como [null] para fazer uma busca geral
        const listaContasParaProcessar = contasIds && contasIds.length > 0 ? contasIds : [null];

        // LOOP 1: Percorre cada conta selecionada
        for (const idConta of listaContasParaProcessar) {
            let pagina = 1;

            console.log(`[Bling] Iniciando processamento da conta: ${idConta || 'GERAL'}`);

            // LOOP 2: Paginação da conta atual
            while (true) {
                try {
                    const response = await axios.get("https://www.bling.com.br/Api/v3/caixas", {
                        params: {
                            pagina: pagina,
                            limite: 100,
                            dataInicial,
                            dataFinal,
                            situacao: 'R',
                            // situacaoConciliacao: 1,
                            idContaFinanceira: idConta || undefined
                        },
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });

                    const lancamentosBling = response.data.data || [];

                    if (lancamentosBling.length === 0) break;

                    const nomeContaBling = lancamentosBling.conta?.descricao || 'Conta não identificada';

                    for (const lanc of lancamentosBling) {
                        const idExternoBling = String(lanc.id);
                        const nomeCategoriaBling = lanc.descricao?.trim().toLowerCase();
                        const valorLancamento = Math.abs(Number(lanc.valor));

                        const infoItem = {
                            id: idExternoBling,
                            descricao: lanc.descricao,
                            valor: valorLancamento,
                            data: lanc.data,
                            conta: idConta || 'Geral',
                            contaNome: nomeContaBling
                        };

                        console.log(`[Bling] Importando: ${lanc.descricao} | Valor: ${valorLancamento}`);

                        // Evita duplicados (id_externo_lancamento é @unique no Prisma)
                        const existe = await prismaClient.lancamentoBi.findUnique({
                            where: { id_externo_lancamento: idExternoBling }
                        });

                        if (existe) {
                            logsIgnorados.push({ ...infoItem, motivo: "Já existe no banco" });
                            continue;
                        }

                        let categoria_id: string | null = null;
                        let subcategoria_id: string | null = null;

                        // Mapeamento de Categoria/Subcategoria
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
                                origem_lancamento: 'IMPORTACAO_BLING',
                                data_lancamento: new Date(lanc.data) // Salvando a data real do lançamento
                            }
                        });

                        logsImportados.push(infoItem);
                    }

                    if (lancamentosBling.length < 100) break;

                    pagina++;
                    await sleep(1000); // Delay entre páginas

                } catch (error) {
                    if (error.response?.status === 429) {
                        await sleep(2000);
                        continue;
                    }
                    console.error(`Erro na conta ${idConta}:`, error.message);
                    break; // Sai do loop desta conta mas continua para a próxima
                }
            }

            // Pequeno delay entre a troca de uma conta para outra para evitar Rate Limit
            await sleep(1000);
        }

        return {
            message: "Importação concluída com sucesso!",
            stats: {
                total_importados: logsImportados.length,
                total_ignorados: logsIgnorados.length,
                contas_processadas: listaContasParaProcessar.length
            }
        };
    }
}

export { ImportLancamentosBlingService };