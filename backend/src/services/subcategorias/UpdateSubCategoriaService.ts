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

        const nomeFormatado = name.trim().toLowerCase();

        // Verifica se já existe outra subcategoria com o mesmo nome na mesma categoria
        const subcategoriaDuplicada = await prismaClient.subCategoria.findFirst({
            where: {
                categoria_id: subCategoriaExiste.categoria_id,
                name: nomeFormatado,
                NOT: {
                    id: subCategoriaExiste.id,
                },
            },
        });

        if (subcategoriaDuplicada) {
            throw new Error(`Já existe uma subcategoria chamada "${name}" nesta categoria.`);
        }

        const updateSubCategoria = await prismaClient.subCategoria.update({
            where: { id },
            data: {
                name: nomeFormatado,
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