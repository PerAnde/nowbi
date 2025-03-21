import { Request, Response } from "express";
import { DeleteGrupoService } from "../../services/grupoEmpresas/DeleteGrupoService";

class DeleteGrupoController {
    async handle(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const deletarGrupoService = new DeleteGrupoService();

            await deletarGrupoService.execute(id);

            return res.status(200).json({ message: "Grupo deletado com sucesso!" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { DeleteGrupoController };
