import prismaClient from "../../prisma";

interface CategoriaData {
    usuario_id: string;
}

class CreateCategoriasNovoUsuarioService {

    async execute({ usuario_id }: CategoriaData) {

        await prismaClient.categoria.createMany({
            data: [
                // Receitas
                { name: "Receitas", tipo: "RECEITA", usuario_id: usuario_id, grupoDre: "RECEITA_OPERACIONAL_BRUTA" },
                { name: "Outras Receitas", tipo: "RECEITA", usuario_id: usuario_id, grupoDre: "OUTRAS_RECEITAS" },

                // Despesas
                { name: "Impostos", tipo: "DESPESA", usuario_id: usuario_id, grupoDre: "DEDUCOES_DA_RECEITA_BRUTA" },
                { name: "Despesas Administrativas", tipo: "DESPESA", usuario_id: usuario_id, grupoDre: "DESPESAS_OPERACIONAIS" },
                { name: "Despesas Com Pessoal", tipo: "DESPESA", usuario_id: usuario_id, grupoDre: "DESPESAS_OPERACIONAIS" },
                { name: "Despesas de Marketing", tipo: "DESPESA", usuario_id: usuario_id, grupoDre: "DESPESAS_OPERACIONAIS" },
                { name: "Despesas Comerciais", tipo: "DESPESA", usuario_id: usuario_id, grupoDre: "DESPESAS_VARIAVEIS" },
                { name: "Despesas Financeiras", tipo: "DESPESA", usuario_id: usuario_id, grupoDre: "DESPESAS_FINANCEIRAS" },
            ]
        })

        const categorias = await prismaClient.categoria.findMany({
            where: { usuario_id },
            select: { id: true, name: true }
        });

        const subcategorias = [];
        for (const categoria of categorias) {
            // Subcategorias de "Receitas"
            if (categoria.name === "Receitas") {
                subcategorias.push({ name: "Serviços Prestados", categoria_id: categoria.id });
                subcategorias.push({ name: "Vendas de Mercadorias", categoria_id: categoria.id });
            }
            // Subcategorias de "Outras Receitas"
            if (categoria.name === "Outras Receitas") {
                subcategorias.push({ name: "Juros Recebidos", categoria_id: categoria.id });
                subcategorias.push({ name: "Outras Receitas", categoria_id: categoria.id });
            }

            // Subcategorias de "Impostos"
            if (categoria.name === "Impostos") {
                subcategorias.push({ name: "COFINS", categoria_id: categoria.id });
                subcategorias.push({ name: "CSLL", categoria_id: categoria.id });
                subcategorias.push({ name: "ISS", categoria_id: categoria.id });
                subcategorias.push({ name: "IRPJ", categoria_id: categoria.id });
                subcategorias.push({ name: "PIS", categoria_id: categoria.id });
                subcategorias.push({ name: "Simples Nacional", categoria_id: categoria.id });
            }

            // Subcategorias de "Despesas Administrativas"
            if (categoria.name === "Despesas Administrativas") {
                subcategorias.push({ name: "Aluguel", categoria_id: categoria.id });
                subcategorias.push({ name: "Contabilidade", categoria_id: categoria.id });
                subcategorias.push({ name: "Contribuições e Associações", categoria_id: categoria.id });
                subcategorias.push({ name: "Energia Elétrica", categoria_id: categoria.id });
                subcategorias.push({ name: "Internet/Telefone", categoria_id: categoria.id });
                subcategorias.push({ name: "Manutenções e Conservações", categoria_id: categoria.id });
                subcategorias.push({ name: "Material de Escritório", categoria_id: categoria.id });
                subcategorias.push({ name: "Material de Uso e Consumo", categoria_id: categoria.id });
                subcategorias.push({ name: "Segurança e Monitoramento", categoria_id: categoria.id });
                subcategorias.push({ name: "Software", categoria_id: categoria.id });
            }

            // Subcategorias de "Despesas Com Pessoal"
            if (categoria.name === "Despesas Com Pessoal") {
                subcategorias.push({ name: "Bonificações", categoria_id: categoria.id });
                subcategorias.push({ name: "FGTS", categoria_id: categoria.id });
                subcategorias.push({ name: "INSS", categoria_id: categoria.id });
                subcategorias.push({ name: "Medicina do Trabalho", categoria_id: categoria.id });
                subcategorias.push({ name: "Pró-labore", categoria_id: categoria.id });
                subcategorias.push({ name: "Salários", categoria_id: categoria.id });
            }

            // Subcategorias de "Despesas de Marketing"
            if (categoria.name === "Despesas de Marketing") {
                subcategorias.push({ name: "Assessoria de Marketing", categoria_id: categoria.id });
            }

            // Subcategorias de "Despesas Comerciais"
            if (categoria.name === "Despesas Comerciais") {
                subcategorias.push({ name: "Comissões Sobre Vendas", categoria_id: categoria.id });
                subcategorias.push({ name: "Fretes de Vendas", categoria_id: categoria.id });
                subcategorias.push({ name: "Taxas de Operadoras", categoria_id: categoria.id });
            }

            // Subcategorias de "Despesas Financeiras"
            if (categoria.name === "Despesas Financeiras") {
                subcategorias.push({ name: "Amortização de Empréstimos", categoria_id: categoria.id });
                subcategorias.push({ name: "Despesas Bancárias", categoria_id: categoria.id });
                subcategorias.push({ name: "Impostos Parcelados", categoria_id: categoria.id });
                subcategorias.push({ name: "IOF", categoria_id: categoria.id });
                subcategorias.push({ name: "Juros Pagos", categoria_id: categoria.id });
            }

        }

        await prismaClient.subCategoria.createMany({
            data: subcategorias
        })

    }

}

export { CreateCategoriasNovoUsuarioService }