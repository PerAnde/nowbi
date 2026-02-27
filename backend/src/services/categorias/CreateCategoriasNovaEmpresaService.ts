import prismaClient from "../../prisma";

interface CategoriaData {
    empresa_id: string;
    usuario_id: string;
}

class CreateCategoriasNovaEmpresaService {
    async execute({ empresa_id, usuario_id }: CategoriaData) {

        await prismaClient.categoria.createMany({
            data: [
                // RECEITA OPERACIONAL BRUTA
                { name: "receitas", tipo: "RECEITA", empresaId: empresa_id, usuario_id: usuario_id, grupoDre: "RECEITA_OPERACIONAL_BRUTA" },
                { name: "outras receitas", tipo: "RECEITA", empresaId: empresa_id, usuario_id: usuario_id, grupoDre: "OUTRAS_RECEITAS" },
                // DEDUCOES DA RECEITA BRUTA
                { name: "impostos", tipo: "DESPESA", empresaId: empresa_id, usuario_id: usuario_id, grupoDre: "DEDUCOES_DA_RECEITA_BRUTA" },
                // CUSTO VARIAVEL
                { name: "custos de mercadorias", tipo: "DESPESA", empresaId: empresa_id, usuario_id: usuario_id, grupoDre: "CUSTO_VARIAVEL" },
                // DESPESAS OPERACIONAIS
                { name: "despesas administrativas", tipo: "DESPESA", empresaId: empresa_id, usuario_id: usuario_id, grupoDre: "DESPESAS_OPERACIONAIS" },
                { name: "despesas com pessoal", tipo: "DESPESA", empresaId: empresa_id, usuario_id: usuario_id, grupoDre: "DESPESAS_OPERACIONAIS" },
                { name: "despesas de marketing", tipo: "DESPESA", empresaId: empresa_id, usuario_id: usuario_id, grupoDre: "DESPESAS_OPERACIONAIS" },
                { name: "despesas financeiras", tipo: "DESPESA", empresaId: empresa_id, usuario_id: usuario_id, grupoDre: "DESPESAS_FINANCEIRAS" },
            ]
        });

        // O restante do código segue a mesma lógica...
        const categorias = await prismaClient.categoria.findMany({
            where: { empresaId: empresa_id },
            select: { id: true, name: true }
        });

        const subcategoriasData = [];
        for (const categoria of categorias) {
            const nomesSub = this.getNomesSubcategorias(categoria.name);
            nomesSub.forEach(nome => {
                subcategoriasData.push({
                    name: nome,
                    categoria_id: categoria.id,
                    empresaId: empresa_id,
                });
            });
        }

        if (subcategoriasData.length > 0) {
            await prismaClient.subCategoria.createMany({
                data: subcategoriasData
            });
        }
    }

    private getNomesSubcategorias(nomeCategoria: string): string[] {
        const dicionario: { [key: string]: string[] } = {
            // RECEITAS
            "receitas": ["venda de produtos", "venda de mercadorias", "prestação de serviços"],
            "outras receitas": ["venda de ativos/imobilizados", "comissões recebidas"],
            // DESPESAS
            "impostos": ["simples nacional", "iss", "icms", "pis/cofins"],

            "despesas administrativas": [
                "aluguel", "condomínio", "contabilidade", "energia elétrica", "internet", "limpeza e manutenção", "material de escritório", "material de uso e consumo", "serviços contábeis", "serviços de terceiros", "software", "telefone", "água", "gás"
            ],
            "despesas com pessoal": ["encargos da folha", "plano de saúde", "pró-labore", "salários", "vale alimentação", "vale transporte", "fgts", "inss"],
            "despesas comerciais": ["alimentação", "brindes", "comissões", "fretes", "propaganda e publicidade"],
            "despesas financeiras": ["amortização de empréstimos", "despesas bancárias", "impostos parcelados", "iof", "juros pagos"]
        };

        return dicionario[nomeCategoria] || [];
    }
}

export { CreateCategoriasNovaEmpresaService };