import prismaClient from "../../prisma";

interface UpdateCategoriaRequest {
    id: string;
    name: string;
    tipo: 'RECEITA' | 'DESPESA';
}

class UpdateCategoriaService {
    async execute({ id, name, tipo }: UpdateCategoriaRequest) {
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

        const updateCategoria = await prismaClient.categoria.update({
            where: { id },
            data: {
                name,
                tipo: estaVinculadoLancamento ? categoriaExiste.tipo : tipo,
            },
            select: {
                id: true,
                name: true,
                tipo: true,
            },
        });

        return updateCategoria
    }
}

export { UpdateCategoriaService }