import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { hash } from 'bcryptjs';

import { sendPasswordChangedEmail } from '../../services/usuario/emailService';

const prisma = new PrismaClient();

class ResetPasswordController {
    async handle(req: Request, res: Response) {
        const { email, token, newPassword } = req.body;

        try {
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

            const resetRecord = await prisma.resetarSenha.findUnique({
                where: { tokenHash }
            });

            if (!resetRecord || resetRecord.email !== email) {
                return res.status(400).json({ error: "Token ou e-mail inválido." });
            }

            if (resetRecord.email !== email) {
                return res.status(400).json({ error: "Token ou e-mail inválido." });
            }

            if (new Date() > resetRecord.expiresAt) {
                await prisma.resetarSenha.delete({ where: { tokenHash } });
                return res.status(400).json({ error: "O link expirou." });
            }

            const passwordHash = await hash(newPassword, 8);

            await prisma.$transaction([
                prisma.usuario.update({
                    where: { email },
                    data: { password: passwordHash }
                }),
                prisma.resetarSenha.delete({ where: { tokenHash } })
            ]);

            sendPasswordChangedEmail(email).catch(err => console.error("Erro ao enviar e-mail de aviso:", err));

            return res.status(200).json({ message: "Senha alterada com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao redefinir senha." });
        }
    }
}

export { ResetPasswordController };