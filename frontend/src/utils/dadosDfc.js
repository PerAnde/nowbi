export const montarEstruturaDfc = (bisParaProcessar) => {
    const mesesProcessados = bisParaProcessar.map(bi => ({
        mesAno: `${bi.mes.toUpperCase()} / ${bi.ano}`,
        lancamentos: bi.lancamentoBi.reduce((acc, lanc) => {
            const catNome = lanc.categoria?.name || "Sem Categoria";
            const subNome = lanc.subcategoria?.name || "Sem Subcategoria";
            
            const chave = `${catNome}|${subNome}`;

            acc[chave] = (acc[chave] || 0) + (Number(lanc.valor) || 0);
            return acc;
        }, {})
    }));

    const mapaDeEstrutura = new Map();

    bisParaProcessar.forEach(bi => {
        bi.lancamentoBi.forEach(l => {
            const catNome = l.categoria?.name || "Sem Categoria";
            const subNome = l.subcategoria?.name || "Sem Subcategoria";
            const chave = `${catNome}|${subNome}`;
            
            const grupoDfc = l.categoria?.grupoDre || l.categoria?.grupo_dfc || l.tipo;

            if (!mapaDeEstrutura.has(chave)) {
                mapaDeEstrutura.set(chave, {
                    categoria: catNome,
                    subcategoria: subNome,
                    tipo: grupoDfc 
                });
            }
        });
    });

    const linhasFormatadas = Array.from(mapaDeEstrutura.values()).map(item => {
        const chaveBusca = `${item.categoria}|${item.subcategoria}`;

        const valoresPorMes = mesesProcessados.map(mes => ({
            mesAno: mes.mesAno,
            valor: Number((mes.lancamentos[chaveBusca] || 0).toFixed(2))
        }));

        const totalAcumulado = valoresPorMes.reduce((acc, curr) => acc + curr.valor, 0);

        return {
            tipo: item.tipo,
            categoria: item.categoria,
            subcategoria: item.subcategoria,
            valoresPorMes,
            totalAcumulado: Number(totalAcumulado.toFixed(2))
        };
    });

    return {
        colunasCabecalho: mesesProcessados.map(m => m.mesAno),
        linhas: linhasFormatadas
    };
};