import { Request, Response } from "express";
import { UpdateCategoriaService } from '../../services/categorias/UpdateCategoriaService'

class UpdateCategoriaController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { name, tipo } = req.body;

        const updateCategoriaService = new UpdateCategoriaService();

        try {
            const empresa = await updateCategoriaService.execute({
                id,
                name,
                tipo,
            });

            return res.json(empresa);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { UpdateCategoriaController }