import { Request, Response } from "express";
import { GenerateReportBiService } from '../../services/bis/GenerateReportBiService';

class GenerateReportBiController {
    async handle(req: Request, res: Response) {
        const { bi_id } = req.params;
        const usuario_id = req.usuario_id;

        const service = new GenerateReportBiService();
        const result = await service.execute({ bi_id, usuario_id });

        return res.json(result);
    }
}

export { GenerateReportBiController }