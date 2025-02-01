import prismaClient from "../../prisma";

interface ListCategoriaRequest {
    usuario_id: string;
    tipo?: 'RECEITA' | 'DESPESA';
}

class ListCategoriasService {
    async execute({ usuario_id, tipo }: ListCategoriaRequest) {
        const where: any = { usuario_id };

        if (tipo) {
            where.tipo = tipo;
        }

        const categorias = await prismaClient.categoria.findMany({
            where,
            select: {
                id: true,
                name: true,
                tipo: true,
                subcategorias: true,
            },
        });

        return categorias;
    }
}

export { ListCategoriasService };
