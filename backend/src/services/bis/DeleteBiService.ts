import prismaClient from "../../prisma";

class DeleteBiService {
    async execute(id: string): Promise<void> {

        const bi = await prismaClient.businessIntelligence.findUnique({
            where: {
                id: id,
            },
        });

        if (!bi) {
            throw new Error("BI não encontrado!");
        }

        await prismaClient.businessIntelligence.delete({
            where: {
                id: id,
            },
        });
    }
}

export { DeleteBiService }