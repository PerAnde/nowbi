import prismaClient from "../../prisma";

interface UpdateStatusBiRequest {
    id: string;
    usuario_id: string;
    status: boolean;
}

class UpdateStatusBiService {
    async execute({ id, status, usuario_id }: UpdateStatusBiRequest) {

        if (!id) {
            throw new Error("Id inválido!")
        }

        // Verifica se o ID do BI existe
        const biExiste = await prismaClient.businessIntelligence.findUnique({
            where: { id },
            include: {
                empresa: true,
            }
        })

        if (!biExiste) {
            throw new Error("BI não encontrado!")
        }

        if (biExiste.empresa.usuario_id !== usuario_id) {
            throw new Error("BI não encontrado!");
        }

        const updateStatusBi = await prismaClient.businessIntelligence.update({
            where: { id },
            data: {
                status
            },
            select: {
                id: true,
                status: true,
            }
        })

        return updateStatusBi

    }

}

export { UpdateStatusBiService }