import prismaClient from "../../prisma";

interface ListCategoriaRequest {
    id: string;
    usuario_id: string;
}

class ListCategoriaService {
    async execute({ id, usuario_id }: ListCategoriaRequest) {
        // const where: any = { usuario_id };

        const categoria = await prismaClient.categoria.findMany({
            where: {
                id: id,
                usuario_id: usuario_id,
            },
            select: {
                id: true,
                name: true,
                tipo: true,
                subcategorias: true,
                grupoDre: true,
            }
        });

        if (!categoria) {
            throw new Error("Categoria não encontrada!")
        }

        return categoria;
    }
}

export { ListCategoriaService };
