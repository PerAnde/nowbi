export const montarEstruturaDfc = (bisParaProcessar) => {

    const mesesProcessados = bisParaProcessar.map(bi => ({
        mesAno: `${bi.mes.toUpperCase()} / ${bi.ano}`,

        dadosAgrupados: bi.lancamentoBi.reduce((acc, lanc) => {
            const chave = `${lanc.tipo}|${lanc.categoria}|${lanc.subcategoria}`;
            acc[chave] = (acc[chave] || 0) + lanc.valor;
            return acc;
        }, {})
    }));

    const todasAsLinhas = new Set();
    bisParaProcessar.forEach(bi => {
        bi.lancamentoBi.forEach(l => {
            todasAsLinhas.add(`${l.tipo}|${l.categoria}|${l.subcategoria}`);
        });
    });

    const linhasFormatadas = Array.from(todasAsLinhas).map(chave => {
        const [tipo, categoria, subcategoria] = chave.split('|');

        const valoresPorMes = mesesProcessados.map(mes => ({
            mesAno: mes.mesAno,
            valor: mes.dadosAgrupados[chave] || 0
        }));

        const totalAcumulado = valoresPorMes.reduce((acc, curr) => acc + curr.valor, 0);

        return {
            tipo,
            categoria,
            subcategoria,
            valoresPorMes,
            totalAcumulado
        };
    });

    return {
        colunasCabecalho: mesesProcessados.map(m => m.mesAno),
        linhas: linhasFormatadas
    };
};