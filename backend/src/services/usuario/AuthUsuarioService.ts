import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
    email: string;
    password: string;
}

class AuthUsuarioService {
    async execute({ email, password }: AuthRequest) {

        // Verificar se o email existe
        const usuario = await prismaClient.usuario.findFirst({
            where: {
                email: email
            }
        })

        if (!usuario) {
            throw new Error("Usuário ou senha inválidos!")
        }

        // Verificar se a senha esta correta
        const validaSenha = await compare(password, usuario.password)

        // Se a senha nao bate
        if (!validaSenha) {
            throw new Error("Usuário ou senha inválidos!")
        }

        // Gerar token e devolver dados
        const token = sign(
            {
                name: usuario.name,
                email: usuario.email,
            },
            process.env.JWT_SECRET,
            {
                subject: usuario.id,
                expiresIn: '30d'
            }
        )

        return {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            token: token,
            isPeriodoTesteAtivo: usuario.isPeriodoTesteAtivo,
            isPlanoAtivo: usuario.isPlanoAtivo,
        }
    }
}

export { AuthUsuarioService }