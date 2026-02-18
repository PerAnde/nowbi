import { Request, Response } from "express";
import { UpdateCategoriaService } from '../../services/categorias/UpdateCategoriaService'

class UpdateCategoriaController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { name, tipo, grupoDre, empresa_id } = req.body;

        const updateCategoriaService = new UpdateCategoriaService();

        try {
            const categoria = await updateCategoriaService.execute({
                id,
                name,
                tipo,
                grupoDre,
                empresa_id
            });

            return res.json(categoria);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { UpdateCategoriaController }