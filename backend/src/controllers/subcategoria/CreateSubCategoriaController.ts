import { Request, Response } from "express";
import { CreateSubCategoriaService } from "../../services/subcategorias/CreateSubCategoriaService";

class CreateSubCategoriaController {

    async handle(req: Request, res: Response) {

        const { name, categoria_id, empresa_id } = req.body;

        const createSubCategoriaService = new CreateSubCategoriaService()

        const subcategoria = await createSubCategoriaService.execute({
            name,
            categoria_id,
            empresa_id
        })

        return res.json(subcategoria)

    }

}

export { CreateSubCategoriaController }