export const INFO_METRICAS = {
    margem_contribuicao: {
        titulo: "Margem de Contribuição",
        explicacao: "Indica quanto sobra da receita para pagar as despesas fixas e gerar lucro após o desconto dos custos variáveis.",
        calculo: "Resultado Bruto - Despesas Variáveis"
    },
    ponto_equilibrio_op: {
        titulo: "Ponto de Equilíbrio Operacional",
        explicacao: "É o volume de receitas necessário para cobrir todas as despesas e custos operacionais, sem lucro nem prejuízo.",
        calculo: "Despesas Operacionais ÷ Margem de Contribuição (Percentual)"
    },
    ponto_equilibrio_fin: {
        titulo: "Ponto de Equilíbrio Financeiro",
        explicacao: "Semelhante ao operacional, mas exclui gastos que não geram saída de caixa (como depreciação).",
        calculo: "(Despesas Operacionais + Despesas Financeiras) ÷ Margem de Contribuição (Percentual)"
    },
    media_faturamento: {
        titulo: "Média de Faturamento",
        explicacao: "Representa a média aritmética das receitas brutas no período selecionado.",
        calculo: "Soma dos Faturamentos ÷ Quantidade de Meses"
    }
};