import { Request, Response } from "express";
import { UpdateEmpresaService } from '../../services/empresas/UpdateEmpresaService'

class UpdateEmpresaController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { name, cnpj_empresa, email_empresa } = req.body;
        const logo_empresa = req.file ? req.file.filename : null;
        const { usuario_id } = req;

        const updateEmpresaService = new UpdateEmpresaService();

        try {
            const empresa = await updateEmpresaService.execute({
                id,
                usuario_id,
                name,
                cnpj_empresa,
                logo_empresa,
                email_empresa
            });

            return res.json(empresa);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { UpdateEmpresaController }