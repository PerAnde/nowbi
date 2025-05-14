import prismaClient from "../../prisma";
import { GrupoDre } from "@prisma/client";

interface UpdateCategoriaRequest {
    id: string;
    name: string;
    tipo: 'RECEITA' | 'DESPESA';
    grupoDre: GrupoDre;
}

// Grupos permitidos por tipo
const gruposPermitidos = {
    RECEITA: [
        "RECEITA_OPERACIONAL_BRUTA",
        "RECEITA_FINANCEIRA",
        "OUTRAS_RECEITAS",
    ] as GrupoDre[],
    DESPESA: [
        "DEDUCOES_DA_RECEITA_BRUTA",
        "CUSTO_VARIAVEL",
        "DESPESAS_OPERACIONAIS",
        "DESPESAS_FINANCEIRAS",
        "DESPESAS_VARIAVEIS",
        "OUTRAS_DESPESAS",
        "IR_CSLL",
    ] as GrupoDre[],
};

class UpdateCategoriaService {
    async execute({ id, name, tipo, grupoDre }: UpdateCategoriaRequest) {
        if (!id) {
            throw new Error("Id inválido!")
        }

        const categoriaExiste = await prismaClient.categoria.findUnique({
            where: { id },
        });

        if (!categoriaExiste) {
            throw new Error("Categoria não encontrada!");
        }

        const estaVinculadoLancamento = await prismaClient.lancamentoBi.findFirst({
            where: {
                categoria_id: id,
            }
        })

        if (estaVinculadoLancamento && tipo !== categoriaExiste.tipo) {
            throw new Error("Não é possível mudar o TIPO dessa categoria, pois ela está vinculada a um lançamento!");
        }

        const tipoFinal = estaVinculadoLancamento
            ? categoriaExiste.tipo
            : tipo;

        // Validação do grupoDre com base no tipo
        if (!gruposPermitidos[tipoFinal].includes(grupoDre)) {
            throw new Error(
                `O grupo DRE "${grupoDre}" não é permitido para o tipo "${tipoFinal}".`
            );
        }

        const updateCategoria = await prismaClient.categoria.update({
            where: { id },
            data: {
                name,
                tipo: estaVinculadoLancamento ? categoriaExiste.tipo : tipo,
                grupoDre: grupoDre ?? categoriaExiste.grupoDre,
            },
            select: {
                id: true,
                name: true,
                tipo: true,
                grupoDre: true,
            },
        });

        return updateCategoria
    }
}

export { UpdateCategoriaService }