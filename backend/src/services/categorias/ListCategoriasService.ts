import prismaClient from "../../prisma";

interface ListCategoriaRequest {
    usuario_id: string;
}

class ListCategoriasService {
    async execute({ usuario_id }: ListCategoriaRequest) {
        const where: any = { usuario_id };

        const categorias = await prismaClient.categoria.findMany({
            where,
            select: {
                id: true,
                name: true,
                tipo: true,
                subcategorias: true,
                grupoDre: true,
            },
        });

        return categorias;

    }
}

export { ListCategoriasService };
