import { Request, Response } from "express";
import { CreateClientService } from "../../services/clients/CreateClientService";

class CreateClientController {
    async handle(req: Request, res: Response) {

        const { name, user_id } = req.body

        const createClientService = new CreateClientService();

        const { originalname, filename: logo_client } = req.file;

        const client = await createClientService.execute({
            name,
            logo_client,
            user_id
        });

        return res.json(client);

    }
}

export { CreateClientController }