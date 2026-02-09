import prismaClient from "../../prisma";

interface UpdateDashboardConfigRequest {
    id: string;
    usuario_id: string;
    mostrar_resumo: boolean;
    mostrar_detalhes: boolean;
    mostrar_dfc: boolean;
    mostrar_dre: boolean;
    mostrar_relatorio: boolean;
}

class UpdateEmpresaDashboardConfigService {
    async execute({
        id,
        usuario_id,
        ...config
    }: UpdateDashboardConfigRequest) {

        const empresa = await prismaClient.empresa.findUnique({
            where: { id },
            select: { usuario_id: true }
        });

        if (!empresa || empresa.usuario_id !== usuario_id) {
            throw new Error("Empresa não encontrada!");
        }

        return prismaClient.empresa.update({
            where: { id },
            data: config,
            select: {
                id: true,
                mostrar_resumo: true,
                mostrar_detalhes: true,
                mostrar_dfc: true,
                mostrar_dre: true,
                mostrar_relatorio: true
            }
        });
    }
}

export { UpdateEmpresaDashboardConfigService };
