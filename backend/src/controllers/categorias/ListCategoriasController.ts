import { Request, Response } from "express";
import { ListCategoriasService } from "../../services/categorias/ListCategoriasService";

class ListCategoriasController {

    async handle(req: Request, res: Response) {

        const { tipo } = req.query;

        const listCategoriaService = new ListCategoriasService()

        const categoria = await listCategoriaService.execute({
            tipo: tipo as 'RECEITA' | 'DESPESA'
        })

        return res.json(categoria)

    }

}

export { ListCategoriasController }