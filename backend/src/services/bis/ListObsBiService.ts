import prismaClient from "../../prisma";

interface RequestData {
    bi_id: string;
}

class ListObsBiService {
    async execute({ bi_id }: RequestData) {
        if (!bi_id) {
            throw new Error("ID inválido!");
        }

        const obs = await prismaClient.observacoesBi.findFirst({
            where: { businessIntelligence_id: bi_id },
            select: {
                conteudo: true,
            }
        });

        return obs; // se não existir, retorna null
    }
}

export { ListObsBiService };
