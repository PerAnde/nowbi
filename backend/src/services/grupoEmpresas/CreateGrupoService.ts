import prismaClient from "../../prisma";

interface GrupoEmpresasRequest {
    name: string;
    email_grupo?: string;
    usuario_id: string;
}

class CreateGrupoEmpresasService {

    async execute({ name, usuario_id }: GrupoEmpresasRequest) {

        if (!name || !usuario_id) {
            throw new Error("Dados inválidos!")
        }

        // const emailGrupoJaExiste = await prismaClient.grupoEmpresa.findFirst({
        //     where: {
        //         email_grupo: email_grupo,
        //     }
        // })

        // if (emailGrupoJaExiste) {
        //     throw new Error("Este e-mail já está em uso por um grupo ou empresa.")
        // }

        const grupoEmpresa = await prismaClient.grupoEmpresa.create({
            data: {
                name: name,
                email_grupo: null, // null por enquanto
                usuario_id: usuario_id
            },
            select: {
                id: true,
                name: true,
                email_grupo: true,
                usuario_id: true,
            }
        })

        return grupoEmpresa;

    }

}

export { CreateGrupoEmpresasService }