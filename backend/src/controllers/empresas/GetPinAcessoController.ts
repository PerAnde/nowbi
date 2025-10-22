import { Request, Response } from "express";
import { GetPinAcessoService } from "../../services/empresas/GetPinAcessoService";

class GetPinAcessoController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { usuario_id } = req;

        const getPinAcessoService = new GetPinAcessoService();

        try {
            const empresa = await getPinAcessoService.execute({ id, usuario_id });
            return res.json(empresa);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { GetPinAcessoController };
