import prismaClient from "../../prisma";

class DeleteLancamentoBiService {

    async execute(id: string): Promise<void> {

        const lancamento = await prismaClient.lancamentoBi.findUnique({
            where: { id: id }
        })

        if (!lancamento) {
            throw new Error("Lançamento não encontrado!")
        }

        await prismaClient.lancamentoBi.delete({
            where: {
                id: id,
            }
        })

    }

}

export { DeleteLancamentoBiService }