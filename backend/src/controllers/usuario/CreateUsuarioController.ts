import { Request, Response } from "express";
import { sendNewCount } from '../../services/usuario/emailService';

// Importando Service
import { CreateUsuarioService } from "../../services/usuario/CreateUsuarioService";

class CreateUsuarioController {
    async handle(req: Request, res: Response) {

        const { name, email, cpf_cnpj, password, telefone } = req.body

        const createUserService = new CreateUsuarioService();

        try {
            const usuario = await createUserService.execute({
                name,
                email,
                cpf_cnpj,
                password,
                telefone
            });

            sendNewCount(name, email, cpf_cnpj, telefone).catch(err => console.error("Erro email:", err));

            return res.json(usuario);
        } catch (err) {
            return res.status(400).json({ error: "Erro ao criar usuário." });
        }
    }
}

export { CreateUsuarioController }