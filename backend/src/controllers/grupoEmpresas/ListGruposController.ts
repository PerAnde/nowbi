import { Request, Response } from "express";
import { ListGruposService } from "../../services/grupoEmpresas/ListGruposService";

class ListGruposController {
    async handle(req: Request, res: Response) {

        const { usuario_id } = req;

        const listGrupoEmpresasService = new ListGruposService();

        const gruposEmpresas = await listGrupoEmpresasService.execute(usuario_id);

        return res.json(gruposEmpresas)

    }
}

export { ListGruposController }