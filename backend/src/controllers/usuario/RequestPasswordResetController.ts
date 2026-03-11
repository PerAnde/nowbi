import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendResetEmail } from '../../services/usuario/emailService';

const prisma = new PrismaClient();

class RequestPasswordResetController {
  async handle(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const user = await prisma.usuario.findUnique({ where: { email } });

      if (!user) {
        // Resposta genérica para evitar User Enumeration
        return res.status(200).json({ message: "Se o e-mail estiver cadastrado, um link foi enviado." });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

      await prisma.$transaction([
        prisma.resetarSenha.deleteMany({ where: { email } }),
        prisma.resetarSenha.create({
          data: { email, tokenHash, expiresAt }
        })
      ]);

      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;
      
      await sendResetEmail(email, resetLink);

      return res.status(200).json({ message: "Link de recuperação enviado com sucesso." });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao processar solicitação." });
    }
  }
}

export { RequestPasswordResetController };