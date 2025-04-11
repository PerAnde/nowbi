import * as XLSX from "xlsx";
import { toast } from "react-toastify";

// Exportar Excel
export const exportarParaExcel = (receitasAgrupadas, despesasAgrupadas, summary, custos, despesasOrdenadas, lucroBruto) => {

    toast.info("Gerando arquivo em Excel aguarde!")

    const dados = [
        ["Demonstração do Resultado do Exercício (DRE)"],
        [],
        ["Descrição", "Total", "Análise Vertical"],

        // Receita Bruta
        ["Receita Bruta"],
        ...Object.entries(receitasAgrupadas).flatMap(([categoria, dados]) => [
            [categoria, dados.total, ((dados.total / summary.receitas) * 100).toFixed(2) + "%"],
            ...Object.entries(dados.subcategorias).map(([sub, valor]) => [
                `  ↳ ${sub}`,
                valor,
                ((valor / summary.receitas) * 100).toFixed(2) + "%"
            ])
        ]),

        // Deduções e Impostos
        ["Deduções e Impostos (-)"],
        ...Object.entries(despesasAgrupadas)
            .filter(([categoria]) => categoria.toLowerCase() === "impostos")
            .flatMap(([categoria, dados]) => [
                [categoria, dados.total, ((dados.total / summary.receitas) * 100).toFixed(2) + "%"],
                ...Object.entries(dados.subcategorias).map(([sub, valor]) => [
                    `  ↳ ${sub}`,
                    valor,
                    ((valor / summary.receitas) * 100).toFixed(2) + "%"
                ])
            ]),
        [],

        // Receita Operacional Líquida
        ["Receita Operacional Líquida", summary.receitas],
        [],

        // Custos Variáveis
        ["Custo Variável (CPV ou CMV)"],
        ...Object.entries(despesasAgrupadas)
            .filter(([categoria]) => categoria.toLowerCase() === "custos")
            .flatMap(([categoria, dados]) => [
                [categoria, dados.total, ((dados.total / summary.receitas) * 100).toFixed(2) + "%"],
                ...Object.entries(dados.subcategorias).map(([sub, valor]) => [
                    `  ↳ ${sub}`,
                    valor,
                    ((valor / summary.receitas) * 100).toFixed(2) + "%"
                ])
            ]),

        // Resultado Bruto
        ["Resultado Bruto", summary.receitas - custos],
        [],

        // Despesas Operacionais
        ["Despesas Operacionais (-)"],
        ...despesasOrdenadas
            .filter(([categoria]) => categoria.toLowerCase() !== "impostos" && categoria.toLowerCase() !== "custos")
            .flatMap(([categoria, dados]) => [
                [categoria, dados.total, ((dados.total / summary.receitas) * 100).toFixed(2) + "%"],
                ...Object.entries(dados.subcategorias).map(([sub, valor]) => [
                    `  ↳ ${sub}`,
                    valor,
                    ((valor / summary.receitas) * 100).toFixed(2) + "%"
                ])
            ]),

        // Lucro/Prejuízo Operacional
        ["Lucro/Prejuízo Operacional", lucroBruto],
        [],

        // Outras Receitas/Despesas
        ["Outras Receitas/Despesas"],
        [],

        // Resultado Antes do IR e CSLL
        ["Resultado Antes do IR e CSLL", lucroBruto],
        [],

        // Lucro/Prejuízo Acumulado
        ["Lucro/Prejuízo Acumulado", lucroBruto, ((lucroBruto / summary.receitas) * 100).toFixed(2) + "%"]
    ];

    const ws = XLSX.utils.aoa_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DRE");

    XLSX.writeFile(wb, "dre.xlsx");
};