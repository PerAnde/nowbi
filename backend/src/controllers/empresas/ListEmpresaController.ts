import { Request, Response } from "express";
import { ListEmpresaService } from "../../services/empresas/ListEmpresaService";

class ListEmpresaController {
    async handle(req: Request, res: Response) {

        const { usuario_id } = req;

        const listEmpresaService = new ListEmpresaService();

        const empresas = await listEmpresaService.execute(usuario_id);

        return res.json(empresas)

    }
}

export { ListEmpresaController }