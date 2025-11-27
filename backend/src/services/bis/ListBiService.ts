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
                observacoes: {
                    select: {
                        conteudo: true,
                    }
                },
                empresa: {
                    select: {
                        id: true,
                        name: true,
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
                        }
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