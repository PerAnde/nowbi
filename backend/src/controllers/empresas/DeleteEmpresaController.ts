import { Request, Response } from "express";
import { DeleteEmpresaService } from "../../services/empresas/DeleteEmpresaService";

class DeleteEmpresaController {
    async handle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { usuario_id } = req;

            const deletarEmpresaService = new DeleteEmpresaService();

            await deletarEmpresaService.execute(id, usuario_id);

            return res.status(200).json({ message: "Empresa deletada com sucesso!" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { DeleteEmpresaController };
