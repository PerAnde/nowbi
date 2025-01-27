import prismaClient from "../../prisma";

interface ListCategoriaRequest {
    tipo?: 'RECEITA' | 'DESPESA';
}

class ListCategoriasService {

    async execute({ tipo }: ListCategoriaRequest) {
        const categorias = await prismaClient.categoria.findMany({
            where: tipo ? { tipo } : {},
            select: {
                id: true,
                name: true,
                tipo: true,
                subcategorias: true,
            }
        })

        return categorias;
    }

}

export { ListCategoriasService }