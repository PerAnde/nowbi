import prismaClient from "../../prisma";

class DetailUsuarioService {
    async execute(usuario_id: string) {

        const usuario = await prismaClient.usuario.findFirst({
            where: {
                id: usuario_id
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        return usuario
    }
}

export { DetailUsuarioService }