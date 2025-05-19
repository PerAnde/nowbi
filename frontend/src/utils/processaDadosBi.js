export const processaDadosBi = (empresa, selectedMonth) => {
    const mesesAtivos = empresa.bis.filter(bi => bi.status);
    const result = {};
    let totalReceitas = 0;
    let totalDespesas = 0;
    // const categorias = {};
    const categoriasPorGrupo = {};
    const subcategorias = {};
    const detalhes = [];

    mesesAtivos.forEach(({ mes, ano, lancamentoBi }) => {
        const mesAnoAtual = `${mes.toUpperCase()} / ${ano}`;

        // Comparação do mês selecionado, ambos em maiúsculas
        if (selectedMonth && mesAnoAtual !== selectedMonth.toUpperCase()) return;

        if (!result[mesAnoAtual]) {
            result[mesAnoAtual] = { receitas: 0, despesas: 0 };
        }

        lancamentoBi.forEach(({ valor, tipo, categoria, subcategoria }) => {
            const valorNum = parseFloat(valor);
            detalhes.push({
                mes: mesAnoAtual,
                tipo,
                valor: valorNum,
                categoria: categoria?.name,
                grupoDre: categoria?.grupoDre,
                subcategoria: subcategoria?.name
            });

            if (tipo === "RECEITA") {
                result[mesAnoAtual].receitas += valorNum;
                totalReceitas += valorNum;
            } else if (tipo === "DESPESA") {
                result[mesAnoAtual].despesas += valorNum;
                totalDespesas += valorNum;
            }

            if (categoria) {
                // Adiciona a categoria ao grupo correspondente no agrupamento
                if (!categoriasPorGrupo[categoria.grupoDre]) {
                    categoriasPorGrupo[categoria.grupoDre] = [];
                }
                categoriasPorGrupo[categoria.grupoDre].push(categoria.name);
            }

            if (subcategoria) {
                subcategorias[subcategoria.name] = (subcategorias[subcategoria.name] || 0) + valorNum;
            }

        });
    });

    return {
        result,
        summary: {
            receitas: totalReceitas,
            despesas: totalDespesas,
            categoriasPorGrupo,
            subcategorias,
            detalhes
        }
    };
};