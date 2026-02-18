// services/categorias/ListCategoriasPorEmpresaService.ts
import prismaClient from "../../prisma";

class ListCategoriasPorEmpresaService {
    async execute(empresa_id: string, usuario_id: string) {
        const categorias = await prismaClient.categoria.findMany({
            where: {
                empresaId: empresa_id,
                usuario_id: usuario_id // Garantia de segurança
            },
            include: {
                subcategorias: true, // Se você for listar as subcategorias também
            },
            orderBy: {
                name: 'asc'
            }
        });

        return categorias;
    }
}

export { ListCategoriasPorEmpresaService };