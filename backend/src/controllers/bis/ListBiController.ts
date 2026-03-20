import { Request, Response } from "express";
import { ListBiService } from '../../services/bis/ListBiService';

class ListBiController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;

        const pagina = req.query.pagina ? Number(req.query.pagina) : 1;

        const listarBiService = new ListBiService();

        const bi = await listarBiService.execute(id, pagina);

        return res.json(bi);

    }

}

export { ListBiController }