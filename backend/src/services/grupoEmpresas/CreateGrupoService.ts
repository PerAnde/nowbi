import prismaClient from "../../prisma";
import crypto from 'crypto'

interface GrupoEmpresasRequest {
    name: string;
    email_grupo: string;
    usuario_id: string;
}

class CreateGrupoEmpresasService {

    async execute({ name, email_grupo, usuario_id }: GrupoEmpresasRequest) {

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

        const link_grupo = crypto.randomBytes(25).toString("hex");

        const grupoEmpresa = await prismaClient.grupoEmpresa.create({
            data: {
                name: name,
                email_grupo: email_grupo ?? "",
                link_grupo: link_grupo,
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