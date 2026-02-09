import { Request, Response } from "express";
import { UpdateEmpresaDashboardConfigService } from "../../services/empresas/UpdateEmpresaDashboardConfigService";

class UpdateEmpresaDashboardConfigController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { usuario_id } = req;

        const {
            mostrar_resumo,
            mostrar_detalhes,
            mostrar_dfc,
            mostrar_dre,
            mostrar_relatorio
        } = req.body;

        const service = new UpdateEmpresaDashboardConfigService();

        try {
            const empresa = await service.execute({
                id,
                usuario_id,
                mostrar_resumo,
                mostrar_detalhes,
                mostrar_dfc,
                mostrar_dre,
                mostrar_relatorio
            });

            return res.json(empresa);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { UpdateEmpresaDashboardConfigController };
