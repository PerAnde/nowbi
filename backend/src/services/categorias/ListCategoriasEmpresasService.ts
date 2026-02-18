import prismaClient from "../../prisma";

class ListCategoriasEmpresasService {
    async execute(usuario_id: string) {
        const empresas = await prismaClient.empresa.findMany({
            where: {
                usuario_id: usuario_id,
            },
            select: {
                id: true,
                name: true,
                logo_empresa: true,
            }
        })

        return empresas;

    }
}

export { ListCategoriasEmpresasService }