import { Request, Response } from "express";
import { AuthUsuarioService } from "../../services/usuario/AuthUsuarioService";

class AuthUsuarioController {
    async handle(req: Request, res: Response) {
        const { email, password } = req.body

        const authUsuarioService = new AuthUsuarioService()

        const auth = await authUsuarioService.execute({
            email,
            password
        })

        return res.json(auth);
    }
}

export { AuthUsuarioController }