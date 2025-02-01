import prismaClient from "../../prisma";

class DeleteCategoriaService {
    async execute(id: string): Promise<void> {
        // Verifica se a categoria existe
        const categoria = await prismaClient.categoria.findUnique({
            where: {
                id: id,
            },
        });

        if (!categoria) {
            throw new Error("Categoria não encontrada!");
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
