import { Request, Response } from "express";
import { CreateBiService } from "../../services/bis/CreateBiService";

class CreateBiController {

    async handle(req: Request, res: Response) {

        const { id } = req.params
        const { mes, ano } = req.body

        const createBiService = new CreateBiService();

        const bi = await createBiService.execute({
            id,
            mes,
            ano,
        })

        return res.json(bi);

    }

}

export { CreateBiController }