import { Request, Response } from 'express';
import { GetContasFinanceirasBlingService } from '../../../../services/integracoes/bling/getContasFinanceirasBling/getContasFinanceirasBlingService';

class GetContasFinanceirasBlingController {
    async handle(req: Request, res: Response) {
        // Pega o empresa_id do token de autenticação ou da query
        const { empresa_id } = req.params;

        const getContasService = new GetContasFinanceirasBlingService();

        try {
            const contas = await getContasService.execute(empresa_id);
            return res.json(contas);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { GetContasFinanceirasBlingController };