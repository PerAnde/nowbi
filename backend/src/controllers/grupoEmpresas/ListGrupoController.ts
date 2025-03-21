import { Request, Response } from "express";
import { ListGrupoService } from "../../services/grupoEmpresas/ListGrupoService";

class ListGrupoController {
    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { usuario_id } = req;

        const listGrupoEmpresaService = new ListGrupoService();

        const grupoEmpresa = await listGrupoEmpresaService.execute(id, usuario_id);

        return res.json(grupoEmpresa)

    }
}

export { ListGrupoController }