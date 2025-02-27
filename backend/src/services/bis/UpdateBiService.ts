import prismaClient from "../../prisma";

interface UpdateBiRequest {
    id: string;
    mes: string;
    ano: number;
}

class UpdateBiService {
    async execute({ id, mes, ano }: UpdateBiRequest) {

        if (!id) {
            throw new Error("Id inválido!")
        }

        if (!['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'].includes(mes)) {
            throw new Error("Selecione um mês válido!")
        }

        if (ano < 2000 || ano > 2100) {
            throw new Error("Selecione um ano entre 2000 e 2100!")
        }

        // Verifica se o ID do BI existe
        const biExiste = await prismaClient.businessIntelligence.findUnique({
            where: { id },
        })

        if (!biExiste) {
            throw new Error("BI não encontrado!")
        }

        // Verifica se ja existe um BI com o mes e ano
        const biJaExiste = await prismaClient.businessIntelligence.findFirst({
            where: {
                mes: mes,
                ano: ano,
            }
        })

        if (biJaExiste) {
            throw new Error(`Já existe um BI para ${mes} de ${ano}!`)
        }


        const updateBi = await prismaClient.businessIntelligence.update({
            where: { id },
            data: {
                mes: mes,
                ano: ano,
            },
            select: {
                id: true,
                mes: true,
                ano: true,
            }
        })

        return updateBi

    }

}

export { UpdateBiService }