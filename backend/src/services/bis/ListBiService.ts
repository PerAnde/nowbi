import prismaClient from "../../prisma";

class ListBiService {

    async execute(id: string, pagina: number = 1) {

        const itensPorPagina = 100;

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
                }
            }
        });

        if (!bi) {
            throw new Error("BI não encontrado!")
        }

        const totaisFinanceiros = await prismaClient.lancamentoBi.groupBy({
            by: ['tipo'],
            where: { businessIntelligence_id: id },
            _sum: {
                valor: true
            }
        });

        const valorTotalGeral = totaisFinanceiros.reduce(
            (acc, curr) => acc + Number(curr._sum.valor || 0),
            0
        );

        const totalRegistros = await prismaClient.lancamentoBi.count({
            where: { businessIntelligence_id: id }
        });

        const lancamentos = await prismaClient.lancamentoBi.findMany({
            where: { businessIntelligence_id: id },
            skip: (pagina - 1) * itensPorPagina,
            take: itensPorPagina,
            orderBy: { created_at: 'desc' },
            include: {
                categoria: true,
                subcategoria: true
            }
        });

        return {
            ...bi,
            lancamentoBi: lancamentos,
            financeiro: {
                valorTotalGeral,
                resumo: totaisFinanceiros
            },
            paginacao: {
                totalRegistros,
                totalPaginas: Math.ceil(totalRegistros / itensPorPagina),
                paginaAtual: pagina
            }
        };

    }

}

export { ListBiService }