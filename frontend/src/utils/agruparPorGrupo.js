export const agruparPorGrupo = (dados) => {
    return dados.reduce((acc, item) => {
        if (!acc[item.grupoDre]) {
            acc[item.grupoDre] = { total: 0, categorias: {} };
        }

        acc[item.grupoDre].total += item.valor;

        if (item.categoria) {
            if (!acc[item.grupoDre].categorias[item.categoria]) {
                acc[item.grupoDre].categorias[item.categoria] = { total: 0, subcategorias: {} };
            }

            acc[item.grupoDre].categorias[item.categoria].total += item.valor;

            if (item.subcategoria) {
                if (!acc[item.grupoDre].categorias[item.categoria].subcategorias[item.subcategoria]) {
                    acc[item.grupoDre].categorias[item.categoria].subcategorias[item.subcategoria] = 0;
                }
                acc[item.grupoDre].categorias[item.categoria].subcategorias[item.subcategoria] += item.valor;
            }
        }

        return acc;
    }, {});
};