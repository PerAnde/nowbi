import prismaClient from "../../prisma";

class ListEmpresaService {
    async execute(id: string) {

        const empresa = await prismaClient.empresa.findMany({
            where: {
                id: id,
            },
        });

        if (!empresa) {
            throw new Error("Empresa não encontrada!")
        }

        return empresa;

    }
}

export { ListEmpresaService }