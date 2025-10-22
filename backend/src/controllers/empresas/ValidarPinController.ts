import { Request, Response } from "express";
import prismaClient from "../../prisma";

class ValidarPinController {
    async handle(req: Request, res: Response) {
        const { pin_acesso } = req.body;
        const { id: link_bi } = req.params;

        if (!link_bi) {
            return res.status(400).json({ error: "Informe o link." });
        }

        const empresa = await prismaClient.empresa.findUnique({
            where: { link_bi },
            select: { pin_acesso: true },
        });

        if (!empresa) {
            return res.status(404).json({ error: "Empresa não encontrada." });
        }

        if (empresa.pin_acesso === null) {
            return res.json({ valido: true });
        }

        if (!pin_acesso) {
            return res.status(400).json({ error: "Informe o PIN." });
        }

        const valido = empresa.pin_acesso === Number(pin_acesso);
        return res.json({ valido });
    }
}

export { ValidarPinController };
