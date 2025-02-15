import { Request, Response } from "express";
import { ListEmpresaService } from "../../services/empresas/ListEmpresaService";

class ListEmpresaController {
    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { usuario_id } = req;

        const listarEmpresaService = new ListEmpresaService();

        const empresa = await listarEmpresaService.execute(id, usuario_id);

        return res.json(empresa)

    }
}

export { ListEmpresaController }