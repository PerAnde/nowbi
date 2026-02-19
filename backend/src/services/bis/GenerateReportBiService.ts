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

function mesTextoParaNumero(mes: string): number | null {
    const mapa: Record<string, number> = {
        "JANEIRO": 1,
        "FEVEREIRO": 2,
        "MARÇO": 3,
        "MARCO": 3,
        "ABRIL": 4,
        "MAIO": 5,
        "JUNHO": 6,
        "JULHO": 7,
        "AGOSTO": 8,
        "SETEMBRO": 9,
        "OUTUBRO": 10,
        "NOVEMBRO": 11,
        "DEZEMBRO": 12,
    };

    return mapa[mes.trim().toUpperCase()] ?? null;
}

function numeroParaMesTexto(numero: number): string {
    const mapa: Record<number, string> = {
        1: "JANEIRO",
        2: "FEVEREIRO",
        3: "MARÇO",
        4: "ABRIL",
        5: "MAIO",
        6: "JUNHO",
        7: "JULHO",
        8: "AGOSTO",
        9: "SETEMBRO",
        10: "OUTUBRO",
        11: "NOVEMBRO",
        12: "DEZEMBRO",
    };

    return mapa[numero];
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

        const mesAtual = mesTextoParaNumero(bi.mes);

        if (!mesAtual) {
            console.log("Valor inválido recebido no campo mes:", bi.mes);
            throw new Error("Mês inválido no BI");
        }

        const { mes: mesAnterior, ano: anoAnterior } = getMesAnterior(mesAtual, bi.ano);

        const biAnterior = await prismaClient.businessIntelligence.findFirst({
            where: {
                mes: numeroParaMesTexto(mesAnterior),
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
# Persona
Atue como um Analista Financeiro Sênior. Sua resposta deve ser EXCLUSIVAMENTE um objeto JSON válido.

# Objetivo
Analise os dados financeiros fornecidos e preencha a estrutura abaixo.

# Regras de Negócio para o JSON:
1. "status_geral": Se lucro < 0 use "critico". Se lucro > 0 mas menor que o mês anterior use "atencao". Se lucro cresceu use "positivo".
2. "blocos": Crie um bloco para Receitas, um para Despesas e um para Lucro.
3. "cor": Use "vermelho" para variações negativas/preocupantes e "verde" para positivas/saudáveis.

# Estrutura do JSON (Output):
{
  "periodo": "MÊS/ANO",
  "status_geral": "string",
  "resumo_executivo": "string",
  "blocos": [
    { "id": "string", "titulo": "string", "cor": "string", "conteudo": "string" }
  ],
  "recomendacoes": ["string"]
}

# Dados Base:
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

        if (!textoGerado) {
            throw new Error("IA não retornou conteúdo.");
        }

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