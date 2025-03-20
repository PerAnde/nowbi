import { Request, Response } from "express";
import { DeleteLancamentosBiService } from "../../services/lancamentosBi/DeleteLancamentosBiService";

class DeleteLancamentosBiController {

    async handle(req: Request, res: Response): Promise<Response> {

        try {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: "Lançamentos inválidos ou não fornecidos!" });
            }

            const deleteLancamentosService = new DeleteLancamentosBiService();

            await deleteLancamentosService.execute(ids);

            return res.status(200).json({ message: "Lançamentos excluído com sucesso!" })

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { DeleteLancamentosBiController }