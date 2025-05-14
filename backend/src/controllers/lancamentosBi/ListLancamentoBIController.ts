import { Request, Response } from "express";
import { ListLancamentoBIService } from "../../services/lancamentosBi/ListLancamentoBIService";

class ListLancamentoBIController {

    async handle(req: Request, res: Response) {
        try {
            const { id } = req.params; // Agora o id virá na URL

            const listLancamentoService = new ListLancamentoBIService();

            const lancamento = await listLancamentoService.execute({
                id,
            });

            return res.json(lancamento);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export { ListLancamentoBIController };
