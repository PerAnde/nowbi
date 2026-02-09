import prismaClient from "../../prisma";

class ListEmpresasService {
    async execute(usuario_id: string) {

        const empresa = await prismaClient.empresa.findMany({
            where: {
                usuario_id: usuario_id,
            },
            select: {
                id: true,
                name: true,
                cnpj_empresa: true,
                logo_empresa: true,
                email_empresa: true,
                bis: true,
                link_bi: true,
                created_at: true,
                updated_at: true,
                pin_acesso: true,
                blingIntegration: true,
                mostrar_resumo: true,
                mostrar_detalhes: true,
                mostrar_dfc: true,
                mostrar_dre: true,
                mostrar_relatorio: true,
            }
        })

        return empresa;

    }
}

export { ListEmpresasService }