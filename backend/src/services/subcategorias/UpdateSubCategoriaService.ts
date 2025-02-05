import prismaClient from "../../prisma";

interface UpdateSubCategoriaRequest {
    id: string;
    name: string;
}

class UpdateSubCategoriaService {
    async execute({ id, name }: UpdateSubCategoriaRequest) {
        if (!id || !name) {
            throw new Error("Id ou nome inválido!")
        }

        const subCategoriaExiste = await prismaClient.subCategoria.findUnique({
            where: { id },
        });

        if (!subCategoriaExiste) {
            throw new Error("Subcategoria não encontrada!");
        }

        const updateSubCategoria = await prismaClient.subCategoria.update({
            where: { id },
            data: {
                name,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return updateSubCategoria
    }
}

export { UpdateSubCategoriaService }