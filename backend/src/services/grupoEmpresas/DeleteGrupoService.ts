import prismaClient from "../../prisma";

class DeleteGrupoService {
    async execute(id: string): Promise<void> {
        // Verifica se a subcategoria existe
        const grupoEmpresa = await prismaClient.grupoEmpresa.findUnique({
            where: {
                id: id,
            },
        });

        if (!grupoEmpresa) {
            throw new Error("Grupo não encontrado!");
        }

        // Remove a subcategoria
        await prismaClient.grupoEmpresa.delete({
            where: {
                id: id,
            },
        });
    }
}

export { DeleteGrupoService };
