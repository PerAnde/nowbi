import { Request, Response } from "express";
import { CreateCategoriaService } from "../../services/categorias/CreateCategoriaService";

class CreateCategoriaController {

    async handle(req: Request, res: Response) {

        const { name, tipo } = req.body;

        const createCategoriaService = new CreateCategoriaService();

        const categoria = await createCategoriaService.execute({
            name,
            tipo
        })

        return res.json(categoria);

    }

}

export { CreateCategoriaController }