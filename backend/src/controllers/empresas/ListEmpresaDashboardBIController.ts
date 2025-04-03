import { Request, Response } from "express";
import { ListEmpresaDashboardBIService } from "../../services/empresas/ListEmpresaDashboardBIService";

class ListEmpresaDashboardBIController {
    async handle(req: Request, res: Response) {

        const { link_bi } = req.params;

        const listarDashboardBI = new ListEmpresaDashboardBIService();

        const empresa = await listarDashboardBI.execute(link_bi)

        return res.json(empresa)

    }
}

export { ListEmpresaDashboardBIController }