import { Request, Response } from "express";
import { UpdateUsuarioService } from "../../services/usuario/UpdateUsuarioService";

class UpdateUsuarioController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;
        const { name, cep, endereco, numero, bairro, cidade, ibge, estado, telefone } = req.body;
        const img_usuario = req.file ? req.file.filename : null;

        const updateUsuarioService = new UpdateUsuarioService();

        try {
            const usuario = await updateUsuarioService.execute({
                id,
                name,
                cep,
                endereco,
                numero,
                bairro,
                cidade,
                ibge,
                estado,
                telefone,
                img_usuario,
            });

            return res.json(usuario)
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }

    }

}

export { UpdateUsuarioController }