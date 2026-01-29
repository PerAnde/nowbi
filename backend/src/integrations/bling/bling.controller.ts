import { Request, Response } from 'express';
import { BlingService } from './bling.service';

import prismaClient from '../../prisma';
import { BlingHomologacaoService } from './bling.homologacao.service';

export const connectBling = (req: Request, res: Response) => {
    const { empresaId } = req.query;

    if (!empresaId) {
        return res.status(400).json({ error: 'empresaId é obrigatório' });
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.BLING_CLIENT_ID!,
        redirect_uri: process.env.BLING_REDIRECT_URI!,
        state: String(empresaId),
        scope: 'produtos produtos.exclusao produtos.gerenciar',
    });

    const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?${params.toString()}`;

    return res.redirect(authUrl);
};

export const callbackBling = async (req: Request, res: Response) => {
    const { code, state: empresaId } = req.query;

    if (!code || !empresaId) {
        return res.status(400).json({ error: 'Code ou empresa não informado!' });
    }

    try {
        const tokenData = await BlingService.trocarCodePorToken(String(code));

        await BlingService.salvarIntegracao({
            empresaId: String(empresaId),
            tokenData,
        });

        return res.status(200).json({
            message: "Debug: Verificando dados do Bling",
            empresaVinculada: empresaId,
            dadosRecebidosDoBling: tokenData
        });

        // return res.redirect(`https://app.nowbi.com.br/integracao-status?provider=Bling&status=success`);
    } catch (error: any) {
        console.error('[BLING ERROR]', error.response?.data || error.message);

        return res.redirect(`https://app.nowbi.com.br/integracao-status?provider=Bling&error=true`);
    }
};

export const homologarBling = async (req: Request, res: Response) => {
    const { empresaId } = req.params;

    const integracao = await prismaClient.blingIntegration.findUnique({
        where: { empresaId },
    });

    if (!integracao) {
        return res.status(404).json({ error: 'Integração não encontrada' });
    }

    try {
        await BlingHomologacaoService.executar(integracao);

        return res.json({
            message: 'Homologação do Bling executada com sucesso',
        });

    } catch (error: any) {
        console.error('[BLING HOMOLOGAÇÃO ERROR]', error.response?.data || error);
        return res.status(500).json({
            error: 'Erro ao executar homologação do Bling',
        });
    }
};