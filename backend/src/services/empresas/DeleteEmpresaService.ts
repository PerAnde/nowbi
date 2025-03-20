import prismaClient from "../../prisma";

class DeleteEmpresaService {
    async execute(id: string, usuario_id: string): Promise<void> {
        // Verifica se a empresa existe
        const empresa = await prismaClient.empresa.findUnique({
            where: {
                id,
            },
            select: {
                usuario_id: true,
            }
        });

        if (!empresa) {
            throw new Error("Empresa não encontrada!");
        }

        if (empresa.usuario_id !== usuario_id) {
            throw new Error("Empresa não encontrada!");
        }

        const businessIntelligences = await prismaClient.businessIntelligence.findMany({
            where: {
                empresa_id: id,
            },
            select: {
                id: true,
            }
        });

        const biIds = businessIntelligences.map(bi => bi.id);

        if (biIds.length > 0) {
            await prismaClient.lancamentoBi.deleteMany({
                where: {
                    businessIntelligence_id: {
                        in: biIds,
                    }
                }
            });

            await prismaClient.businessIntelligence.deleteMany({
                where: {
                    empresa_id: id,
                }
            });
        }

        // Remove a empresa
        await prismaClient.empresa.delete({
            where: {
                id,
            },
        });
    }
}

export { DeleteEmpresaService };
