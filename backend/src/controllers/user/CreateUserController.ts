import { Request, Response } from "express";

// Importando Service
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
    async handle(req: Request, res: Response) {

        const { name, email, cpf_cnpj, password } = req.body

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({
            name,
            email,
            cpf_cnpj,
            password
        });

        return res.json(user)
    }
}

export { CreateUserController }