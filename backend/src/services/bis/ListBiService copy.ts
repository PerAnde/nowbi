import prismaClient from "../../prisma";

class ListBiService {

    async execute(id: string) {

        const bi = await prismaClient.businessIntelligence.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                mes: true,
                ano: true,
                status: true,
                relatorio_ia_gerado: true,
                empresa: {
                    select: {
                        id: true,
                        name: true,
                        blingIntegration: {
                            select: {
                                id: true,
                                accessToken: true,
                                refreshToken: true,
                                isActive: true,
                            }
                        },
                    }
                },
                lancamentoBi: {
                    select: {
                        id: true,
                        valor: true,
                        tipo: true,
                        created_at: true,
                        categoria: {
                            select: {
                                name: true,
                            }
                        },
                        subcategoria: {
                            select: {
                                name: true,
                            }
                        },
                        origem_lancamento: true,
                    }
                },
            }
        });

        if (!bi) {
            throw new Error("BI não encontrado!")
        }

        return bi;

    }

}

export { ListBiService }