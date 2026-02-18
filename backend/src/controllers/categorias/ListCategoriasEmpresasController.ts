import { Request, Response } from "express";
import { ListCategoriasEmpresasService } from "../../services/categorias/ListCategoriasEmpresasService";

class ListCategoriasEmpresasController {
    async handle(req: Request, res: Response) {

        const { usuario_id } = req;

        const listCategoriasEmpresaService = new ListCategoriasEmpresasService();

        const empresas = await listCategoriasEmpresaService.execute(usuario_id);

        return res.json(empresas)

    }
}

export { ListCategoriasEmpresasController }