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
                    select: {
                        mes: true,
                        ano: true,
                        status: true,
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