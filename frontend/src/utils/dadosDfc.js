// src/utils/processaDfc.js

export const montarEstruturaDfc = (bisParaProcessar) => {
    // 1. Mapeia cada mês individualmente
    const mesesProcessados = bisParaProcessar.map(bi => ({
        mesAno: `${bi.mes.toUpperCase()} / ${bi.ano}`,
        // Agrupa os lançamentos desse mês específico
        dadosAgrupados: bi.lancamentoBi.reduce((acc, lanc) => {
            const chave = `${lanc.tipo}|${lanc.categoria}|${lanc.subcategoria}`;
            acc[chave] = (acc[chave] || 0) + lanc.valor;
            return acc;
        }, {})
    }));

    // 2. Cria uma lista ÚNICA de todas as categorias/subcategorias que aparecem no período
    // Isso evita que a tabela "pule" colunas se um mês não teve certo gasto
    const todasAsLinhas = new Set();
    bisParaProcessar.forEach(bi => {
        bi.lancamentoBi.forEach(l => {
            todasAsLinhas.add(`${l.tipo}|${l.categoria}|${l.subcategoria}`);
        });
    });

    // 3. Monta a "Matrix" Final
    const linhasFormatadas = Array.from(todasAsLinhas).map(chave => {
        const [tipo, categoria, subcategoria] = chave.split('|');

        // Para cada linha, gera o valor em cada um dos meses
        const valoresPorMes = mesesProcessados.map(mes => ({
            mesAno: mes.mesAno,
            valor: mes.dadosAgrupados[chave] || 0
        }));

        // Calcula o total acumulado daquela linha específica
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