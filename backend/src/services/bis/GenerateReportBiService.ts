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

        const agruparSubcategorias = (lancamentos: any[]) => {
            const agrupado = lancamentos.reduce((acc, curr) => {
                // Mudamos de .categoria para .subcategoria
                const nomeSub = curr.subcategoria?.name || curr.categoria?.name || "Outros";
                acc[nomeSub] = (acc[nomeSub] || 0) + Number(curr.valor);
                return acc;
            }, {});

            return Object.entries(agrupado)
                .map(([nome, valor]) => ({ nome, valor }))
                .sort((a, b) => (b.valor as number) - (a.valor as number));
        };

        const rankingSubReceitas = agruparSubcategorias(receitasAtual);
        const rankingSubDespesas = agruparSubcategorias(despesasAtual);

        const formatarMoeda = (valor) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        };

        // 5) Dados estruturados para IA
        const dadosParaIA = {
            empresa: bi.empresa.name,

            topSubReceitas: rankingSubReceitas.slice(0, 3),
            topSubDespesas: rankingSubDespesas.slice(0, 3),

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
Atue como um Analista Financeiro Sênior especializado em gestão de fluxo de caixa. Sua resposta deve ser EXCLUSIVAMENTE um objeto JSON válido.

# Objetivo
Analise os dados financeiros da empresa ${bi.empresa.name} e preencha os campos abaixo com análises realistas e diretas.

# Regras de Escrita:
1. CRITICALIDADE: Não seja genérico. Se o lucro caiu enquanto a receita subiu, aponte ineficiência operacional. Se as despesas fixas estão altas, alerte sobre o ponto de equilíbrio.
2. NUNCA INVENTE NÚMEROS: Use apenas as informações fornecidas.
3. FORMATAÇÃO HTML: Use <b> para ênfase e <ul>/<li> para listas, mas SEMPRE mantenha o formato JSON válido.
4. FOCO: Seja direto e objetivo, evite rodeios. Vá direto ao ponto em cada análise.
5. ATENÇÃO: Se os dados forem insuficientes para alguma análise, indique claramente que não há dados suficientes.
6. Utilize <b> para destacar termos chave e itens de <li> para listar categorias ou recomendações.

# Estrutura do JSON Obrigatória:
{
  "periodo_mes": "Relatório Financeiro - ${bi.mes}/${bi.ano}",
  "resumo_geral": "Forneça um panorama de alto nível sobre a saúde financeira da ${bi.empresa.name}. Conecte o lucro de R$ ${formatarMoeda(lucroAtual)} com a eficiência do período. Use <b> para destacar termos chave.",
  "analise_receita": "Analise o faturamento de R$ ${formatarMoeda(totalReceitasAtual)}. Explique o impacto da variação de ${dadosParaIA.comparativos.variacaoReceitas}%. Liste em <ul> as 3 categorias de maior peso com base nos dados e comente se há dependência excessiva de uma única fonte.",
  "analise_despesa": "Analise o desembolso de R$ ${formatarMoeda(totalDespesasAtual)}. Foque na relação entre custo fixo vs variável. Identifique se o aumento de ${dadosParaIA.comparativos.variacaoDespesas}% na despesa é justificado pelo crescimento ou se é um sinal de alerta. Liste em <ul> as 3 categorias de maior peso com base nos dados.",
  "pontos_atencao": "Liste riscos imediatos com base nos dados fornecidos. Use <li> para cada ponto crítico/atenção.",
  "recomendacoes": "Se possível dê até 3 recomendaçãoes com base nos dados fornecidos. Use <li> para cada recomendação. Evite conselhos óbvios como 'monitore os dados'.",
  "conclusao": "Conclusão final sobre a situação financeira deste mês e projeção de risco para o próximo período baseado na tendência atual."
}

# Dados Base:
\`\`\`json
${JSON.stringify(dadosParaIA, null, 2)}
\`\`\`
        `;

        // 7) OpenAI
        const chatCompletion = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const dadosIA = JSON.parse(chatCompletion.choices[0].message.content || "{}");

        if (!dadosIA) {
            throw new Error("IA não retornou conteúdo.");
        }

        // 8) Salvar no banco
        const response = await prismaClient.observacoesBi.upsert({
            where: { businessIntelligence_id: bi_id },
            update: {
                conteudo: chatCompletion.choices[0].message.content, // Backup do JSON
                periodo_mes: dadosIA.periodo_mes,
                resumo_geral: dadosIA.resumo_geral,
                analise_receita: dadosIA.analise_receita,
                analise_despesa: dadosIA.analise_despesa,
                pontos_atencao: dadosIA.pontos_atencao,
                recomendacoes: dadosIA.recomendacoes,
                conclusao: dadosIA.conclusao
            },
            create: {
                businessIntelligence_id: bi_id,
                conteudo: chatCompletion.choices[0].message.content || "",
                periodo_mes: dadosIA.periodo_mes,
                resumo_geral: dadosIA.resumo_geral,
                analise_receita: dadosIA.analise_receita,
                analise_despesa: dadosIA.analise_despesa,
                pontos_atencao: dadosIA.pontos_atencao,
                recomendacoes: dadosIA.recomendacoes,
                conclusao: dadosIA.conclusao
            }
        });

        return response
    }
}

export { GenerateReportBiService };