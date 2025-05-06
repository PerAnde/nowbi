import { Request, Response, NextFunction } from "express";
import prismaClient from "../prisma";

export async function verificaStatusConta(req: Request, res: Response, next: NextFunction) {

    const usuario_id = req.usuario_id;

    if (!usuario_id) {
        return res.status(401).json({ message: "Não autenticado!" });
    }

    try {
        const usuario = await prismaClient.usuario.findUnique({
            where: { id: usuario_id }
        })

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" })
        }

        // Se tem plano ativo, prossegue
        if (usuario.isPlanoAtivo === true) {
            return next();
        }

        // Verificando se esta no peridoo de teste, do contrario bloqueio o acesso permitindo apenas o acesso a /planos
        const dataAtual = new Date();
        const fimDoTeste = new Date(usuario.dataFimPeriodoTeste);

        if (dataAtual > fimDoTeste) {

            if (usuario.isPeriodoTesteAtivo == true) {
                await prismaClient.usuario.update({
                    where: { id: usuario_id },
                    data: {
                        isPeriodoTesteAtivo: false,
                    }
                })
            }

            const rotaLiberada = req.path.startsWith("/planos")
            if (!rotaLiberada) {
                return res.status(403).json({
                    message: "Seu período de teste expirou. Para continuar, ative a sua conta!",
                });
            }
        }

        return next();

    } catch (error) {
        console.error("Erro ao verificar status da conta:", error)
        return res.status(500).json({ message: "Erro ao verificar status da conta!" })
    }


}
