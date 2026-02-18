// controllers/categorias/ListCategoriasPorEmpresaController.ts
import { Request, Response } from "express";
import { ListCategoriasPorEmpresaService } from "../../services/categorias/ListCategoriasPorEmpresaService";

class ListCategoriasPorEmpresaController {
    async handle(req: Request, res: Response) {
        const empresa_id = req.params.id;
        const usuario_id = req.usuario_id;
        
        const listService = new ListCategoriasPorEmpresaService();
        const categorias = await listService.execute(empresa_id, usuario_id);

        return res.json(categorias);
    }
}

export { ListCategoriasPorEmpresaController };