import prismaClient from "../../prisma";

interface SubCategoriaRequest {
    name: string,
    categoria_id: string,
}

class CreateSubCategoriaService {

    async execute({ name, categoria_id }: SubCategoriaRequest) {

        if (!name || !categoria_id) {
            throw new Error("Nome ou ID inválido!")
        }

        const subcategoria = await prismaClient.subCategoria.create({
            data: {
                name: name,
                categoria_id: categoria_id,
            },
            select: {
                id: true,
                name: true,
                categoria_id: true,
            }
        })

        return subcategoria

    }

}

export { CreateSubCategoriaService }