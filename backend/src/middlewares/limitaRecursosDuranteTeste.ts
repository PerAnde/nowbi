import { Request, Response, NextFunction } from "express";
import prismaClient from "../prisma";

export async function limitaRecursosDuranteTeste(req: Request, res: Response, next: NextFunction) {

    const usuario_id = req.usuario_id;

    try {

        const usuario = await prismaClient.usuario.findUnique({
            where: { id: usuario_id }
        })

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" })
        }

        if (!usuario.isPeriodoTesteAtivo) {
            return next();
        }

        // Verifica quantidade de empresas
        const empresas = await prismaClient.empresa.findMany({
            where: { usuario_id: usuario_id },
        });

        if(empresas.length >= 1 && req.path.includes("/empresas")){
            return res.status(403).json({
                message: "Durante o período de teste é permitido cadastrar apenas 1 CNPJ.",
            })
        }

        return next();

    } catch (error) {
        console.error("Erro ao verificar limite de recursos:", error)
        return res.status(500).json({ message: "Erro ao verificar limite de recursos!" })
    }

}