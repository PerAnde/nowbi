import prismaClient from "../../prisma";

class ListGruposService {
    async execute(usuario_id: string) {

        const gruposEmpresas = await prismaClient.grupoEmpresa.findMany({
            where: {
                usuario_id: usuario_id,
            },
            select: {
                id: true,
                name: true,
                email_grupo: true,
                empresas: true,
                created_at: true,
                updated_at: true,
            }
        })

        return gruposEmpresas;

    }
}

export { ListGruposService }