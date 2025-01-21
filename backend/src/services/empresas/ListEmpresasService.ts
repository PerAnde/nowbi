import prismaClient from "../../prisma";

class ListEmpresasService {
    async execute(usuario_id: string) {

        const empresa = await prismaClient.empresa.findMany({
            where: {
                usuario_id: usuario_id,
            }
        })

        return empresa;

    }
}

export { ListEmpresasService }