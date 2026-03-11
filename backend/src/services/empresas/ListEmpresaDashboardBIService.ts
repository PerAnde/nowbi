import prismaClient from "../../prisma";

class ListEmpresaDashboardBIService {

    async execute(link_bi: string) {

        const empresa = await prismaClient.empresa.findUnique({
            where: { link_bi },
            select: {
                id: true,
                name: true,
                cnpj_empresa: true,
                logo_empresa: true,
                usuario: {
                    select: {
                        name: true,
                        img_usuario: true,
                    },
                },
                mostrar_resumo: true,
                mostrar_detalhes: true,
                mostrar_dfc: true,
                mostrar_dre: true,
                mostrar_relatorio: true,
                bis: {
                    where: { status: true },
                    select: {
                        id: true,
                        mes: true,
                        ano: true,
                        status: true,
                        observacoes: {
                            select: {
                                periodo_mes: true,
                                resumo_geral: true,
                                analise_receita: true,
                                analise_despesa: true,
                                pontos_atencao: true,
                                recomendacoes: true,
                                conclusao: true,
                            }
                        },
                        lancamentoBi: {
                            select: {
                                valor: true,
                                tipo: true,
                                categoria: true,
                                subcategoria: true,
                            }
                        }
                    }
                },

            }
        })

        if (!empresa) {
            throw new Error("Empresa não encontrada!")
        }

        return empresa;

    }

}

export { ListEmpresaDashboardBIService }