import { Request, Response } from "express";
import { DetailUsuarioService } from "../../services/usuario/DetailUsuarioService";

class DetailUsuarioController {
    async handle(req: Request, res: Response) {

        const usuario_id = req.usuario_id;

        const detailUsuarioService = new DetailUsuarioService();

        const usuario = await detailUsuarioService.execute(usuario_id);

        return res.json(usuario);

    }
}

export { DetailUsuarioController }