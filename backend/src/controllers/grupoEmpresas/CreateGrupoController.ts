import { Request, Response } from "express";
import { CreateGrupoEmpresasService } from "../../services/grupoEmpresas/CreateGrupoService";

class CreateGrupoController {

    async handle(req: Request, res: Response) {

        const { name, email_grupo } = req.body;
        const usuario_id = req.usuario_id;

        const createGrupoEmpresasService = new CreateGrupoEmpresasService();

        const grupoEmpresa = await createGrupoEmpresasService.execute({
            name,
            email_grupo,
            usuario_id
        })

        return res.json(grupoEmpresa)

    }

}

export { CreateGrupoController }