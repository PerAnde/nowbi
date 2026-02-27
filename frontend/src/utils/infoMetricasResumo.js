export const INFO_METRICAS = {
    margem_contribuicao: {
        titulo: "Margem de Contribuição",
        descricaoCurta:
            "Valor que sobra da receita após custos e despesas variáveis.",
        descricaoDetalhada:
            "A Margem de Contribuição representa o valor que sobra da receita após o pagamento dos custos e despesas variáveis.\n\nEla mostra quanto cada venda contribui para pagar as despesas fixas da empresa e gerar lucro.",
        calculo:
            "Margem de Contribuição = Receita Bruta – Custos Variáveis – Despesas Variáveis",
        resumo:
            "Quanto maior a margem, maior a capacidade da empresa de gerar lucro e cobrir seus custos fixos."
    },

    ponto_equilibrio_op: {
        titulo: "Ponto de Equilíbrio Operacional",
        descricaoCurta:
            "Faturamento mínimo para não ter lucro nem prejuízo.",
        descricaoDetalhada:
            "É o volume de receitas necessário para cobrir todas as despesas e custos operacionais, sem gerar lucro ou prejuízo.\n\nNesse ponto, o resultado da empresa é igual a zero.",
        calculo:
            "Despesas Fixas ÷ Margem de Contribuição (Percentual)",
        resumo:
            "Se o faturamento estiver acima desse valor, a empresa gera lucro. Se estiver abaixo, gera prejuízo."
    },

    ponto_equilibrio_fin: {
        titulo: "Ponto de Equilíbrio Financeiro",
        descricaoCurta:
            "Faturamento necessário para manter o caixa saudável.",
        descricaoDetalhada:
            "Semelhante ao ponto de equilíbrio operacional, porém considera apenas despesas que geram saída real de caixa.\n\nDesconsidera itens contábeis como depreciação e amortização.",
        calculo:
            "(Despesas Fixas com saída de caixa) ÷ Margem de Contribuição (Percentual)",
        resumo:
            "Mostra o valor mínimo necessário para que a empresa não comprometa seu fluxo de caixa."
    },

    media_faturamento: {
        titulo: "Média de Faturamento",
        descricaoCurta:
            "Média das receitas dentro do período analisado.",
        descricaoDetalhada:
            "Representa a média das receitas brutas no período selecionado.\n\nAjuda a identificar estabilidade, crescimento ou queda no desempenho financeiro.",
        calculo:
            "Soma dos Faturamentos ÷ Quantidade de Meses",
        resumo:
            "Permite comparar o desempenho atual com a média histórica."
    }
};