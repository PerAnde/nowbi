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

        const nomeFormatado = name.trim().toLowerCase();

        // Verifica se já existe uma subcategoria com o mesmo nome (case insensitive) na mesma categoria
        const subcategoriaNomeJaExiste = await prismaClient.subCategoria.findFirst({
            where: {
                categoria_id,
                name: nomeFormatado,
            },
        });

        if (subcategoriaNomeJaExiste) {
            throw new Error(`Já existe uma subcategoria chamada "${name}" nesta categoria.`);
        }

        const subcategoria = await prismaClient.subCategoria.create({
            data: {
                name: nomeFormatado,
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