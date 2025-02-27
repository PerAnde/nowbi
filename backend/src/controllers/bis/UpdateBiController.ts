import { Request, Response } from "express";
import { UpdateBiService } from "../../services/bis/UpdateBiService";

class UpdateBiController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { mes, ano } = req.body;

        const updateBiService = new UpdateBiService();

        try {
            const bi = await updateBiService.execute({
                id,
                mes,
                ano,
            });

            return res.json(bi);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { UpdateBiController }