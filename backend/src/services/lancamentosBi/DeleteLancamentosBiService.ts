import prismaClient from "../../prisma";

class DeleteLancamentosBiService {

    async execute(ids: string[]): Promise<void> {

        if (!ids || ids.length === 0) {
            throw new Error("Nenhum lançamento selecionado para exclusão!")
        }

        await prismaClient.lancamentoBi.deleteMany({
            where: {
                id: { in: ids },
            }
        })

    }

}

export { DeleteLancamentosBiService }