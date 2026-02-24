import prismaClient from "../../prisma";

class DeleteBiService {
    async execute(id: string, usuario_id: string): Promise<void> {

        const bi = await prismaClient.businessIntelligence.findUnique({
            where: {
                id
            },
            include: {
                empresa: true,
            }
        });

        if (!bi) {
            throw new Error("BI não encontrado!");
        }

        if (bi.empresa.usuario_id !== usuario_id) {
            throw new Error("BI não encontrado!");
        }

        await prismaClient.observacoesBi.deleteMany({
            where: {
                businessIntelligence_id: id,
            }
        })

        await prismaClient.lancamentoBi.deleteMany({
            where: {
                businessIntelligence_id: id,
            }
        })

        await prismaClient.businessIntelligence.delete({
            where: {
                id: id,
            },
        });
    }
}

export { DeleteBiService }