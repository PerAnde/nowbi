import { Request, Response } from "express";
import { CreateEmpresaService } from "../../services/empresas/CreateEmpresaService";

class CreateEmpresaController {
    async handle(req: Request, res: Response) {

        const { name, usuario_id } = req.body

        const createEmpresaService = new CreateEmpresaService();

        const { originalname, filename: logo_empresa } = req.file;

        const empresa = await createEmpresaService.execute({
            name,
            logo_empresa,
            usuario_id
        });

        return res.json(empresa);

    }
}

export { CreateEmpresaController }