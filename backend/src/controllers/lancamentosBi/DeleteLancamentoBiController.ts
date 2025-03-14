import { Request, Response } from "express";
import { DeleteLancamentoBiService } from "../../services/lancamentosBi/DeleteLancamentoBiService";

class DeleteLancamentoBiController {

    async handle(req: Request, res: Response) {

        try {
            const { id } = req.params;

            const deleteLancamentoService = new DeleteLancamentoBiService();

            await deleteLancamentoService.execute(id);

            return res.status(200).json({ message: "Lançamento excluído com sucesso!" })

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    }

}

export { DeleteLancamentoBiController }