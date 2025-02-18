import prismaClient from "../../prisma";

class DeleteEmpresaService {
    async execute(id: string): Promise<void> {
        // Verifica se a empresa existe
        const empresa = await prismaClient.empresa.findUnique({
            where: {
                id: id,
            },
        });

        if (!empresa) {
            throw new Error("Empresa não encontrada!");
        }

        await prismaClient.businessIntelligence.deleteMany({
            where: {
                empresa_id: id,
            }
        })

        // Remove a empresa
        await prismaClient.empresa.delete({
            where: {
                id: id,
            },
        });
    }
}

export { DeleteEmpresaService };
