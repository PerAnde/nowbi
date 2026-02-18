import prismaClient from "../../prisma";

interface DeleteRequest {
    id: string;
    empresa_id: string;
}

class DeleteSubCategoriaService {
    async execute({ id, empresa_id }: DeleteRequest): Promise<void> {
        // Verifica se a subcategoria existe
        const subCategoria = await prismaClient.subCategoria.findUnique({
            where: {
                id: id,
            },
        });

        if (!subCategoria) {
            throw new Error("Categoria não encontrada!");
        }

        if (subCategoria.empresaId !== empresa_id) {
            throw new Error("Ação não permitida.");
        }

        const temLancamento = await prismaClient.lancamentoBi.findFirst({
            where: {
                subcategoria_id: id
            }
        });

        if (temLancamento) {
            throw new Error("Não é possível excluir essa subcategoria, pois ela está vinculada a um lançamento!");
        }

        // Remove a subcategoria
        await prismaClient.subCategoria.delete({
            where: {
                id: id,
            },
        });
    }
}

export { DeleteSubCategoriaService };
