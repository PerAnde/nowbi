import { Request, Response } from "express";
import { ListEmpresasService } from "../../services/empresas/ListEmpresasService";

class ListEmpresasController {
    async handle(req: Request, res: Response) {

        const { usuario_id } = req;

        const listEmpresaService = new ListEmpresasService();

        const empresas = await listEmpresaService.execute(usuario_id);

        return res.json(empresas)

    }
}

export { ListEmpresasController }