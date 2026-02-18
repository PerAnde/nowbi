import { Request, Response } from "express";
import { DeleteSubCategoriaService } from "../../services/subcategorias/DeleteSubCategoriaService";

class DeleteSubCategoriaController {
    async handle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { empresa_id } = req.body;

            const deletarSubCategoriaService = new DeleteSubCategoriaService();

            await deletarSubCategoriaService.execute({ id, empresa_id });

            return res.status(200).json({ message: "Subcategoria deletada com sucesso!" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { DeleteSubCategoriaController };
