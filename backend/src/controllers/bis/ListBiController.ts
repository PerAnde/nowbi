import { Request, Response } from "express";
import { ListBiService } from '../../services/bis/ListBiService';

class ListBiController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;

        const listarBiService = new ListBiService();

        const bi = await listarBiService.execute(id);

        return res.json(bi);

    }

}

export { ListBiController }