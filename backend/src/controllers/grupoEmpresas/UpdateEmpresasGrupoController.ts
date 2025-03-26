import { Request, Response } from "express";
import { UpdateEmpresasGrupoService } from '../../services/grupoEmpresas/UpdateEmpresasGrupoService'

class UpdateEmpresasGrupoController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { adicionar_empresa, remover_empresa } = req.body;

        const updateEmpresasGrupoService = new UpdateEmpresasGrupoService();

        try {
            const grupoAtualizado = await updateEmpresasGrupoService.execute({
                id,
                adicionar_empresa,
                remover_empresa
            });

            return res.json(grupoAtualizado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { UpdateEmpresasGrupoController }