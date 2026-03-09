import { Request, Response } from "express";
import { DetailUsuarioAjudaService } from "../../services/usuario/DetailUsuarioAjudaService";

class DetailUsuarioAjudaController {
    async handle(req: Request, res: Response) {

        const usuario_id = req.usuario_id;

        const detailUsuarioAjudaService = new DetailUsuarioAjudaService();

        const usuario = await detailUsuarioAjudaService.execute(usuario_id);

        return res.json(usuario);

    }
}

export { DetailUsuarioAjudaController }