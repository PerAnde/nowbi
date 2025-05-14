import prismaClient from "../../prisma";

interface ListLancamentoRequest {
    id: string;
}

class ListLancamentoBIService {
    async execute({ id }: ListLancamentoRequest) {
        const lancamento = await prismaClient.lancamentoBi.findUnique({
            where: {
                id: id,
            },
            include: {
                categoria: true,
                subcategoria: true,
            }
        });

        if (!lancamento) {
            throw new Error("Lançamento não encontrado!");
        }

        return lancamento;
    }
}

export { ListLancamentoBIService };
