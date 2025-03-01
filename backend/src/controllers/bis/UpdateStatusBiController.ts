import { Request, Response } from "express";
import { UpdateStatusBiService } from "../../services/bis/UpdateStatusBiService";

class UpdateStatusBiController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { status } = req.body;
        const { usuario_id } = req;

        const updateStatusBiService = new UpdateStatusBiService();

        try {
            const bi = await updateStatusBiService.execute({
                id,
                status,
                usuario_id,
            });

            return res.json(bi);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { UpdateStatusBiController }