import { Request, Response } from "express";
import { DeleteCategoriaService } from "../../services/categorias/DeleteCategoriaService";

class DeleteCategoriaController {
    async handle(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const deletarCategoriaService = new DeleteCategoriaService();

            await deletarCategoriaService.execute(id);

            return res.status(200).json({ message: "Categoria deletada com sucesso!" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { DeleteCategoriaController };
