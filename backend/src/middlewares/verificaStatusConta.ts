import { Request, Response, NextFunction } from "express";
import prismaClient from "../prisma";

export async function verificaStatusConta(req: Request, res: Response, next: NextFunction) {
    const usuario_id = req.usuario_id;

    if (!usuario_id) {
        return res.status(401).json({ message: "Não autenticado!" });
    }

    try {
        const usuario = await prismaClient.usuario.findUnique({
            where: { id: usuario_id },
            select: {
                isPlanoAtivo: true,
                isPeriodoTesteAtivo: true,
                dataFimPeriodoTeste: true,
            }
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        // Se tem plano ativo, prossegue normalmente
        if (usuario.isPlanoAtivo) {
            return next();
        }

        // Se está em período de teste, verifica se ainda está dentro do prazo
        if (usuario.isPeriodoTesteAtivo && usuario.dataFimPeriodoTeste) {
            const dataAtual = new Date();
            const fimDoTeste = new Date(usuario.dataFimPeriodoTeste);

            if (dataAtual <= fimDoTeste) {
                // Ainda no período de teste
                return next();
            }

            // Teste expirado: desativa o período de teste
            await prismaClient.usuario.update({
                where: { id: usuario_id },
                data: {
                    isPeriodoTesteAtivo: false,
                }
            });

            // Bloqueia acesso exceto à rota /planos
            const rotaLiberada = req.path.startsWith("/planos");
            if (!rotaLiberada) {
                return res.status(403).json({
                    message: "Seu período de teste expirou. Para continuar, ative a sua conta!",
                });
            }

            return next(); // permite acesso à rota /planos mesmo com teste expirado
        }

        // Se não tem plano ativo e não está mais em teste
        const rotaLiberada = req.path.startsWith("/planos");
        if (!rotaLiberada) {
            return res.status(403).json({
                message: "Sua conta está inativa. Para continuar, ative a sua conta!",
            });
        }

        return next(); // rota /planos é liberada

    } catch (error) {
        console.error("Erro ao verificar status da conta:", error);
        return res.status(500).json({ message: "Erro ao verificar status da conta!" });
    }
}
