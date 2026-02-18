import { Request, Response } from "express";
import { UpdateSubCategoriaService } from '../../services/subcategorias/UpdateSubCategoriaService'

class UpdateSubCategoriaController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { name, empresa_id } = req.body;

        const updateSubCategoriaService = new UpdateSubCategoriaService();

        try {
            const subcategoria = await updateSubCategoriaService.execute({
                id,
                name,
                empresa_id,
            });

            return res.json(subcategoria);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { UpdateSubCategoriaController }