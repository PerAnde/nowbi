import { Request, Response } from "express";
import { UpdateLancamentoBiService } from "../../services/lancamentosBi/UpdateLancamentoBiService";

class UpdateLancamentoBiController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { valor, tipo, categoria, subcategoria } = req.body;

        const updateLancamentoBiService = new UpdateLancamentoBiService();

        try {
            const lancamento = await updateLancamentoBiService.execute({
                id,
                valor,
                tipo,
                categoria,
                subcategoria,
            });

            return res.json(lancamento)
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { UpdateLancamentoBiController }