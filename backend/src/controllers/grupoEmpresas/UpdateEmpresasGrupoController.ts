import { Request, Response } from "express";
import { UpdateEmpresasGrupoService } from '../../services/grupoEmpresas/UpdateEmpresasGrupoService'

class UpdateEmpresasGrupoController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { empresa_id, acao } = req.body;

        const updateEmpresasGrupoService = new UpdateEmpresasGrupoService();

        try {
            const grupoAtualizado = await updateEmpresasGrupoService.execute({
                id,
                empresa_id,
                acao
            });

            return res.json(grupoAtualizado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { UpdateEmpresasGrupoController }