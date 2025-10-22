import { Request, Response } from "express";
import { UpdatePinAcessoService } from "../../services/empresas/UpdatePinAcessoService";

class UpdatePinAcessoController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { pin_acesso } = req.body;
        const { usuario_id } = req;

        const updatePinAcessoService = new UpdatePinAcessoService();

        try {
            if (pin_acesso && !/^\d{4}$/.test(pin_acesso)) {
                return res.status(400).json({ error: "O PIN deve conter 4 dígitos" });
            }

            const empresa = await updatePinAcessoService.execute({
                id,
                usuario_id,
                pin_acesso,
            });

            return res.json(empresa);

        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }

    }
}

export { UpdatePinAcessoController };