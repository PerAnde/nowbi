import { Request, Response } from "express";
import { UpdateGrupoService } from '../../services/grupoEmpresas/UpdateGrupoService'

class UpdateGrupoController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { name, email_grupo } = req.body;

        const updateGrupoService = new UpdateGrupoService();

        try {
            const grupoEmpresa = await updateGrupoService.execute({
                id,
                name,
                email_grupo,
            });

            return res.json(grupoEmpresa);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { UpdateGrupoController }