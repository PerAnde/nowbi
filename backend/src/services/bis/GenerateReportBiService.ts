import prismaClient from "../../prisma";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string
});

interface RequestData {
    bi_id: string;
    usuario_id: string;
}

function getMesAnterior(mes: number, ano: number) {
    if (mes === 1) {
        return { mes: 12, ano: ano - 1 };
    }
    return { mes: mes - 1, ano };
}

function variacaoPercentual(atual: number, anterior: number) {
    if (!anterior || anterior === 0) return null;
    return Number((((atual - anterior) / anterior) * 100).toFixed(2));
}

class GenerateReportBiService {
    async execute({ bi_id, usuario_id }: RequestData) {

        // 1) Buscar BI ATUAL
        const bi = await prismaClient.businessIntelligence.findUnique({
            where: { id: bi_id },
            select: {
                id: true,
                mes: true,
                ano: true,
                status: true,
                empresa: {
                    select: {
                        id: true,
                        name: true,
                        usuario_id: true
                    }
                },
                lancamentoBi: {
                    select: {
                        valor: true,
                        tipo: true,
                        created_at: true,
                        categoria: { select: { name: true } },
                        subcategoria: { select: { name: true } }
                    }
                }
            }
        });

        if (!bi) throw new Error("BI não encontrado");
        if (bi.empresa.usuario_id !== usuario_id) throw new Error("Acesso negado");

        // 2) Buscar BI MÊS ANTERIOR
        const mesAtual = Number(bi.mes);

        if (isNaN(mesAtual)) {
            throw new Error("Mês inválido no BI");
        }

        const { mes: mesAnterior, ano: anoAnterior } = getMesAnterior(mesAtual, bi.ano);

        const biAnterior = await prismaClient.businessIntelligence.findFirst({
            where: {
                mes: String(mesAnterior),
                ano: anoAnterior,
                empresa_id: bi.empresa.id,
                status: true
            },
            select: {
                lancamentoBi: {
                    select: {
                        valor: true,
                        tipo: true
                    }
                }
            }
        });

        // 3) Processar dados - MÊS ATUAL
        const receitasAtual = bi.lancamentoBi.filter(l => l.tipo === "RECEITA");
        const despesasAtual = bi.lancamentoBi.filter(l => l.tipo === "DESPESA");

        const totalReceitasAtual = receitasAtual.reduce((acc, r) => acc + Number(r.valor), 0);
        const totalDespesasAtual = despesasAtual.reduce((acc, d) => acc + Number(d.valor), 0);
        const lucroAtual = totalReceitasAtual - totalDespesasAtual;

        // 4) Processar dados - MÊS ANTERIOR
        const receitasAnterior = biAnterior?.lancamentoBi.filter(l => l.tipo === "RECEITA") ?? [];
        const despesasAnterior = biAnterior?.lancamentoBi.filter(l => l.tipo === "DESPESA") ?? [];

        const totalReceitasAnterior = receitasAnterior.reduce((acc, r) => acc + Number(r.valor), 0);
        const totalDespesasAnterior = despesasAnterior.reduce((acc, d) => acc + Number(d.valor), 0);
        const lucroAnterior = totalReceitasAnterior - totalDespesasAnterior;

        // 5) Dados estruturados para IA
        const dadosParaIA = {
            empresa: bi.empresa.name,

            periodoAtual: {
                mes: bi.mes,
                ano: bi.ano,
                receitas: totalReceitasAtual,
                despesas: totalDespesasAtual,
                lucro: lucroAtual
            },

            periodoAnterior: biAnterior ? {
                mes: mesAnterior,
                ano: anoAnterior,
                receitas: totalReceitasAnterior,
                despesas: totalDespesasAnterior,
                lucro: lucroAnterior
            } : null,

            comparativos: {
                variacaoReceitas: variacaoPercentual(totalReceitasAtual, totalReceitasAnterior),
                variacaoDespesas: variacaoPercentual(totalDespesasAtual, totalDespesasAnterior),
                variacaoLucro: variacaoPercentual(lucroAtual, lucroAnterior)
            }
        };

        // 6) Prompt
        const prompt = `
Gere um relatório de análise financeira referente ao mês atual.

Requisitos (DEVE CONTER):

- Destaque os principais dados financeiros
- Compare com o mês anterior
- Análise de receitas
- Análise de despesas
- Avalie o lucro
- Identifique tendências
- Aponte pontos de atenção
- Sugira recomendações práticas
- Faça um conclusão objetiva sobre o mês

Formato do relatório:

# Relatório Financeiro - [Mês/Ano]

## Resumo Executivo

[Texto]

## Análise Detalhada

### Receitas
[Texto]

### Despesas
[Texto]

### Lucro
[Texto]

## Tendências e Pontos de Atenção
[Texto]

## Recomendações
[Texto]

## Conclusão
[Texto]

NUNCA INVENTE dados ou informações adicionais.
Utilize EXCLUSIVAMENTE os dados abaixo como base.

Dados base:
\`\`\`json
${JSON.stringify(dadosParaIA, null, 2)}
\`\`\`
        `;

        // 7) OpenAI
        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: prompt
        });

        const textoGerado = response.output_text;

        // 8) Salvar no banco
        const atualizado = await prismaClient.observacoesBi.upsert({
            where: { businessIntelligence_id: bi_id },
            update: { conteudo: textoGerado },
            create: {
                businessIntelligence_id: bi_id,
                conteudo: textoGerado
            }
        });

        return { conteudo: atualizado.conteudo };
    }
}

export { GenerateReportBiService };