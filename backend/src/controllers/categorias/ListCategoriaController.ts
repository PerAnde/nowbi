import { Request, Response } from "express";
import { ListCategoriaService } from "../../services/categorias/ListCategoriaService";

class ListCategoriaController {

    async handle(req: Request, res: Response) {

        const { usuario_id } = req;
        const { id } = req.params;

        const listCategoriaService = new ListCategoriaService()

        const categoria = await listCategoriaService.execute({
            id,
            usuario_id
        })

        return res.json(categoria)

    }

}

export { ListCategoriaController }