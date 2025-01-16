import { Request, Response } from "express";
import { CreateEmpresaService } from "../../services/empresas/CreateEmpresaService";

class CreateEmpresaController {
    async handle(req: Request, res: Response) {

        const { name, cnpj_empresa } = req.body
        const usuario_id = req.usuario_id;
        // Caso esteja enviando imagem, lidando com ela
        const logo_empresa = req.file ? req.file.filename : null;

        const createEmpresaService = new CreateEmpresaService();

        // const { originalname, filename: logo_empresa } = req.file;

        const empresa = await createEmpresaService.execute({
            name,
            cnpj_empresa,
            logo_empresa,
            usuario_id
        });

        return res.json(empresa);

    }
}

export { CreateEmpresaController }