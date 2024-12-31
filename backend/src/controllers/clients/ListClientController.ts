import { Request, Response } from "express";
import { ListClientService } from "../../services/clients/ListClientService";

class ListClientController {
    async handle(req: Request, res: Response) {

        const { user_id } = req;

        const listClientService = new ListClientService();

        const clients = await listClientService.execute(user_id);

        return res.json(clients)

    }
}

export { ListClientController }