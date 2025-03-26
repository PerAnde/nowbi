import prismaClient from "../../prisma";

class ListGrupoService {
    async execute(id: string, usuario_id: string) {

        const grupoEmpresa = await prismaClient.grupoEmpresa.findMany({
            where: {
                id: id,
                usuario_id: usuario_id,
            },
            select: {
                id: true,
                name: true,
                email_grupo: true,
                empresas: {
                    select: {
                        id: true,
                        name: true,
                        cnpj_empresa: true,
                        created_at: true,
                        logo_empresa: true,
                        bis: true,
                    }
                },
                created_at: true,
                updated_at: true,
            }
        })

        return grupoEmpresa;

    }
}

export { ListGrupoService }