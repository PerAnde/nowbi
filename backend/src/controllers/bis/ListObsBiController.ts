import { Request, Response } from "express";
import { ListObsBiService } from "../../services/bis/ListObsBiService";

class ListObsBiController {
    async handle(req: Request, res: Response) {
        const { bi_id } = req.params;
        const service = new ListObsBiService();

        try {
            const obs = await service.execute({ bi_id });
            return res.json(obs);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { ListObsBiController };
