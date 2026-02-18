import { Request, Response } from "express";
import { CreateCategoriaService } from "../../services/categorias/CreateCategoriaService";

class CreateCategoriaController {

    async handle(req: Request, res: Response) {

        const { name, tipo, grupoDre, empresa_id } = req.body;
        const usuario_id = req.usuario_id;

        const createCategoriaService = new CreateCategoriaService();

        const categoria = await createCategoriaService.execute({
            name,
            tipo,
            usuario_id,
            grupoDre,
            empresa_id
        })

        return res.json(categoria);

    }

}

export { CreateCategoriaController }