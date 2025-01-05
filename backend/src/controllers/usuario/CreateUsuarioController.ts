import { Request, Response } from "express";

// Importando Service
import { CreateUsuarioService } from "../../services/usuario/CreateUsuarioService";

class CreateUsuarioController {
    async handle(req: Request, res: Response) {

        const { name, email, cpf_cnpj, password } = req.body

        const createUserService = new CreateUsuarioService();

        const usuario = await createUserService.execute({
            name,
            email,
            cpf_cnpj,
            password
        });

        return res.json(usuario)
    }
}

export { CreateUsuarioController }