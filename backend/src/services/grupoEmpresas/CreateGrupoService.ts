import prismaClient from "../../prisma";

interface GrupoEmpresasRequest {
    name: string;
    email_grupo: string;
    usuario_id: string;
}

class CreateGrupoEmpresasService {

    async execute({ name, email_grupo, usuario_id }: GrupoEmpresasRequest) {

        if (!name || !email_grupo || !usuario_id) {
            throw new Error("Dados inválidos!")
        }

        const grupoEmpresa = await prismaClient.grupoEmpresa.create({
            data: {
                name: name,
                email_grupo: email_grupo,
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