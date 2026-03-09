import prismaClient from "../../prisma";

class DetailUsuarioAjudaService {
    async execute(usuario_id: string) {

        const usuario = await prismaClient.usuario.findFirst({
            where: {
                id: usuario_id
            },
            select: {
                isPeriodoTesteAtivo: true,
                isPlanoAtivo: true,
                dataFimPeriodoTeste: true,
            }
        })

        return usuario;
    }
}

export { DetailUsuarioAjudaService }