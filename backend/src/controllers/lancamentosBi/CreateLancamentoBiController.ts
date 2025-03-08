import { Request, Response } from "express";
import { CreateLancamentoBiService } from "../../services/lancamentosBi/CreateLancamentoBiService";

class CreateLancamentoBiController {

    async handle(req: Request, res: Response) {

        const { id } = req.params
        const { valor, tipo, categoria, subcategoria } = req.body;

        const createLancamentoBiService = new CreateLancamentoBiService();

        const lancamentoBi = await createLancamentoBiService.execute({
            valor,
            tipo,
            categoria,
            subcategoria,
            id,
        })

        return res.json(lancamentoBi);

    }

}

export { CreateLancamentoBiController }