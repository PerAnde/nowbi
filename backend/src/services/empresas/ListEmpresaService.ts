import prismaClient from "../../prisma";

class ListEmpresaService {
    async execute(id: string, usuario_id: string) {

        const empresa = await prismaClient.empresa.findMany({
            where: {
                id: id,
                usuario_id: usuario_id,
            },
            select: {
                name: true,
                bis: true,
                blingIntegration: true,
            }
        });

        if (!empresa) {
            throw new Error("Empresa não encontrada!")
        }

        return empresa;

    }
}

export { ListEmpresaService }