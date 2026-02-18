import prismaClient from "../../prisma";

interface DeleteRequest {
    id: string;
    empresa_id: string;
}

class DeleteCategoriaService {
    async execute({ id, empresa_id }: DeleteRequest): Promise<void> {
        // Verifica se a categoria existe
        const categoria = await prismaClient.categoria.findUnique({
            where: {
                id: id,
            },
        });

        if (!categoria) {
            throw new Error("Categoria não encontrada!");
        }

        if (categoria.empresaId !== empresa_id) {
            throw new Error("Ação não permitida.");
        }

        const estaVinculadaLancamento = await prismaClient.lancamentoBi.findFirst({
            where: {
                categoria_id: id,
            }
        })

        if (estaVinculadaLancamento) {
            throw new Error("Não é possível excluir essa categoria, pois ela está vinculada a um lançamento!");
        }

        await prismaClient.subCategoria.deleteMany({
            where: {
                categoria_id: id,
            }
        })

        // Remove a categoria
        await prismaClient.categoria.delete({
            where: {
                id: id,
            },
        });
    }
}

export { DeleteCategoriaService };
