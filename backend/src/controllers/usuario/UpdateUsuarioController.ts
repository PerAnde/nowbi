import { Request, Response } from "express";
import { UpdateUsuarioService } from "../../services/usuario/UpdateUsuarioService";

class UpdateUsuarioController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { name } = req.body;

        const updateUsuarioService = new UpdateUsuarioService();

        try {
            const usuario = await updateUsuarioService.execute({
                id,
                name,
            });

            return res.json(usuario)
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }

    }

}

export { UpdateUsuarioController }