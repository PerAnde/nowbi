import { Request, Response } from "express";
import { ListCategoriasService } from "../../services/categorias/ListCategoriasService";

class ListCategoriasController {

    async handle(req: Request, res: Response) {

        const { usuario_id } = req;

        const listCategoriaService = new ListCategoriasService()

        const categoria = await listCategoriaService.execute({
            usuario_id,
        })

        return res.json(categoria)

    }

}

export { ListCategoriasController }