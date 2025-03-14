import prismaClient from "../../prisma";

interface BiRequest {
    mes: string;
    ano: number;
    id: string;
}

class CreateBiService {

    async execute({ mes, ano, id }: BiRequest) {

        if (!['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'].includes(mes)) {
            throw new Error("Selecione um mês válido!")
        }

        if (ano < 2000 || ano > 2050) {
            throw new Error("Selecione um ano entre 2000 e 2050!")
        }

        const biJaExiste = await prismaClient.businessIntelligence.findFirst({
            where: {
                mes: mes,
                ano: ano,
                empresa_id: id,
            }
        })

        if (biJaExiste) {
            throw new Error(`Já existe um BI para ${mes} de ${ano}!`)
        }

        const bi = await prismaClient.businessIntelligence.create({
            data: {
                mes: mes,
                ano: ano,
                empresa_id: id,
            },
            select: {
                id: true,
                mes: true,
                ano: true,
                empresa_id: true,
            }
        })

        return bi

    }

}

export { CreateBiService }