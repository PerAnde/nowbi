import prismaClient from "../../prisma";

class DeleteSubCategoriaService {
    async execute(id: string): Promise<void> {
        // Verifica se a subcategoria existe
        const subCategoria = await prismaClient.subCategoria.findUnique({
            where: {
                id: id,
            },
        });

        if (!subCategoria) {
            throw new Error("Categoria não encontrada!");
        }

        // Remove a subcategoria
        await prismaClient.subCategoria.delete({
            where: {
                id: id,
            },
        });
    }
}

export { DeleteSubCategoriaService };
