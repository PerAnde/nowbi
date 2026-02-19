import { Request, Response } from "express";
import { UpdateObsBiService } from "../../services/bis/UpdateObsBiService";

class UpdateObsBiController {
    async handle(req: Request, res: Response) {
        const { bi_id } = req.params;
        const { usuario_id } = req;

        const dados = req.body;

        const service = new UpdateObsBiService();

        try {
            const result = await service.execute({
                bi_id,
                usuario_id,
                ...dados
            });

            return res.json(result);

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}

export { UpdateObsBiController };
