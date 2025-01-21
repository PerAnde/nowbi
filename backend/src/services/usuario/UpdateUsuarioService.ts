import prismaClient from "../../prisma";

interface UpdateUsuarioRequest {
    id: string,
    name: string,
}

class UpdateUsuarioService {

    async execute({ id, name }: UpdateUsuarioRequest) {

        if (!id) {
            throw new Error("Id inválido!")
        }

        const usuarioExiste = await prismaClient.usuario.findUnique({
            where: { id },
        })

        if (!usuarioExiste) {
            throw new Error("Usuário não encontrado!")
        }

        const updateUsuario = await prismaClient.usuario.update({
            where: { id },
            data: {
                name,
            },
            select: {
                id: true,
                name: true
            }
        })

        return updateUsuario

    }

}

export { UpdateUsuarioService }