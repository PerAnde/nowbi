import prismaClient from "../../prisma";

class ListBiService {

    async execute(id: string) {

        const bi = await prismaClient.businessIntelligence.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                mes: true,
                ano: true,
                status: true,
                empresa_id: true,
            }
        });

        if (!bi) {
            throw new Error("BI não encontrado!")
        }

        return bi;

    }

}

export { ListBiService }