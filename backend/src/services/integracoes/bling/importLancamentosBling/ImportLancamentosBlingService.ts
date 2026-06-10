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

        const listaContasParaProcessar = contasIds && contasIds.length > 0 ? contasIds : [null];

        for (const idConta of listaContasParaProcessar) {
            let pagina = 1;

            console.log(`[Bling] Iniciando processamento da conta: ${idConta || 'GERAL'}`);

            while (true) {
                try {
                    const response = await axios.get("https://www.bling.com.br/Api/v3/caixas", {
                        params: {
                            pagina: pagina,
                            limite: 100,
                            dataInicial,
                            dataFinal,
                            situacao: 'R', // Apenas realizados
                            idContaFinanceira: idConta || undefined
                        },
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });

                    const lancamentosBling = response.data.data || [];

                    if (lancamentosBling.length === 0) break;

                    const nomeContaBling = lancamentosBling.conta?.descricao || 'Conta não identificada';

                    for (const lanc of lancamentosBling) {
                        const idExternoBling = String(lanc.id);

                        // CORREÇÃO 1: Pegar a categoria correta do objeto do Bling. 
                        // Se o Bling enviar apenas o ID ou descrição da categoria dentro de lanc.categoria:
                        const nomeCategoriaBling = lanc.categoria?.descricao?.trim().toLowerCase() || lanc.descricao?.trim().toLowerCase();

                        const valorLancamento = Math.abs(Number(lanc.valor));

                        // Define o tipo baseado no padrão do Bling (C = Crédito/Receita, D = Débito/Despesa)
                        const tipoLancamento = lanc.debCred === 'C' ? 'RECEITA' : 'DESPESA';

                        const infoItem = {
                            id: idExternoBling,
                            descricao: lanc.descricao,
                            categoriaBling: lanc.categoria?.descricao || "Sem Categoria",
                            valor: valorLancamento,
                            data: lanc.data,
                            conta: idConta || 'Geral',
                            contaNome: nomeContaBling
                        };

                        // Evita duplicados
                        const existe = await prismaClient.lancamentoBi.findUnique({
                            where: { id_externo_lancamento: idExternoBling }
                        });

                        if (existe) {
                            logsIgnorados.push({ ...infoItem, motivo: "Já existe no banco" });
                            continue;
                        }

                        let categoria_id: string | null = null;
                        let subcategoria_id: string | null = null;

                        // CORREÇÃO 2: Busca primeiro na SubCategoria garantindo que a categoria Pai seja do mesmo TIPO
                        const subNoBanco = await prismaClient.subCategoria.findFirst({
                            where: {
                                empresaId: empresa_id,
                                name: { equals: nomeCategoriaBling, mode: 'insensitive' }, // Garante case-insensitive no banco
                                categoria: {
                                    tipo: tipoLancamento // Valida se a Categoria Pai é RECEITA ou DESPESA
                                }
                            }
                        });

                        if (subNoBanco) {
                            subcategoria_id = subNoBanco.id;
                            categoria_id = subNoBanco.categoria_id;
                        } else {
                            // Se não achar subcategoria, busca na Categoria principal filtrando por Tipo
                            const catNoBanco = await prismaClient.categoria.findFirst({
                                where: {
                                    empresaId: empresa_id,
                                    name: { equals: nomeCategoriaBling, mode: 'insensitive' },
                                    tipo: tipoLancamento // Filtra pelo Enum (RECEITA / DESPESA)
                                }
                            });
                            if (catNoBanco) {
                                categoria_id = catNoBanco.id;
                            }
                        }

                        // Se mesmo assim não mapear, gera o log detalhado informando o erro de vínculo
                        if (!categoria_id) {
                            logsIgnorados.push({
                                ...infoItem,
                                motivo: `Categoria/Subcategoria "${lanc.categoria?.descricao || lanc.descricao}" do tipo [${tipoLancamento}] não encontrada no banco.`
                            });
                            continue;
                        }

                        // Criação do registro usando estritamente o seu Schema Prisma
                        await prismaClient.lancamentoBi.create({
                            data: {
                                valor: valorLancamento,
                                tipo: tipoLancamento, // Enum TipoCategoria (RECEITA / DESPESA)
                                categoria_id,
                                subcategoria_id,
                                businessIntelligence_id: bi.id,
                                id_externo_lancamento: idExternoBling,
                                origem_lancamento: 'IMPORTACAO_BLING',
                                data_lancamento: new Date(lanc.data)
                            }
                        });

                        logsImportados.push(infoItem);
                    }

                    if (lancamentosBling.length < 100) break;

                    pagina++;
                    await sleep(1000);

                } catch (error: any) {
                    if (error.response?.status === 429) {
                        await sleep(2000);
                        continue;
                    }
                    console.error(`Erro na conta ${idConta}:`, error.message);
                    break;
                }
            }

            await sleep(1000);
        }

        return {
            message: "Importação concluída com sucesso!",
            stats: {
                total_importados: logsImportados.length,
                total_ignorados: logsIgnorados.length,
                contas_processadas: listaContasParaProcessar.length
            },
            ignorados: logsIgnorados // Retornado para você conseguir ver no console/resposta o motivo exato se travar de novo
        };
    }
}

export { ImportLancamentosBlingService };