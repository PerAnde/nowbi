import prismaClient from "../../prisma";

class ListEmpresasService {
    async execute(usuario_id: string) {

        const empresa = await prismaClient.empresa.findMany({
            where: {
                usuario_id: usuario_id,
            },
            select: {
                id: true,
                name: true,
                cnpj_empresa: true,
                logo_empresa: true,
                bis: true,
                created_at: true,
                updated_at: true,
            }
        })

        return empresa;

    }
}

export { ListEmpresasService }