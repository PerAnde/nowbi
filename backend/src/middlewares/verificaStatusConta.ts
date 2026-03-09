import { Request, Response, NextFunction } from "express";
import prismaClient from "../prisma";

export async function verificaStatusConta(req: Request, res: Response, next: NextFunction) {
    const usuario_id = req.usuario_id;
    if (!usuario_id) return res.status(401).json({ message: "Não autenticado!" });

    try {
        const usuario = await prismaClient.usuario.findUnique({
            where: { id: usuario_id },
            select: {
                isPlanoAtivo: true,
                isPeriodoTesteAtivo: true,
                dataFimPeriodoTeste: true,
            }
        });

        if (!usuario) return res.status(404).json({ message: "Usuário não encontrado!" });

        // 1. Se tem plano ativo, libera acesso total
        if (usuario.isPlanoAtivo) return next();

        // 2. Lógica de Verificação de Expiração
        const dataAtual = new Date();
        const fimDoTeste = usuario.dataFimPeriodoTeste ? new Date(usuario.dataFimPeriodoTeste) : null;

        const testeAindaValido = usuario.isPeriodoTesteAtivo && fimDoTeste && dataAtual <= fimDoTeste;

        // 3. Se o teste ainda é válido, libera acesso total
        if (testeAindaValido) return next();

        // 4. Se o teste expirou agora, atualizamos o status no banco de forma silenciosa
        if (usuario.isPeriodoTesteAtivo && fimDoTeste && dataAtual > fimDoTeste) {
            await prismaClient.usuario.update({
                where: { id: usuario_id },
                data: { isPeriodoTesteAtivo: false }
            });
        }

        // 5. FILTRO DE ROTAS PARA USUÁRIOS EXPIRADOS
        // Verificamos se ele está tentando acessar rotas informativas (Ajuda ou os próprios dados)
        const rotaLiberada = req.path.includes("/ajuda") || req.path.includes("/user");

        if (rotaLiberada) {
            // Se for uma dessas rotas, deixamos passar mesmo com plano expirado
            return next();
        }

        // 6. BLOQUEIO PARA QUALQUER OUTRA ROTA
        return res.status(403).json({
            error: "EXPIRADO",
            message: "Seu período de teste expirou. Para continuar, ative a sua conta!",
        });

    } catch (error) {
        console.error("Erro no middleware de status:", error);
        return res.status(500).json({ message: "Erro interno ao verificar status da conta." });
    }
}