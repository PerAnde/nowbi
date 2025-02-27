import { Request, Response } from "express";
import { DeleteBiService } from "../../services/bis/DeleteBiService";

class DeleteBiController {
    async handle(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const deletarBiService = new DeleteBiService();

            await deletarBiService.execute(id);

            return res.status(200).json({ message: "BI Excluído com sucesso!" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { DeleteBiController }