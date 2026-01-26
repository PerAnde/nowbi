import { Request, Response } from 'express';
import { BlingService } from './bling.service';

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

    if (!code) {
        return res.status(400).json({ error: 'Code não informado pelo Bling' });
    }

    try {
        const tokenData = await BlingService.trocarCodePorToken(String(code));

        console.log('[BLING TOKEN]', tokenData);

        // ⚠️ Por enquanto só retornamos
        // Depois vamos salvar no banco
        return res.status(200).json({
            message: 'Integração com Bling realizada com sucesso',
            empresaId,
            tokenData,
        });
    } catch (error: any) {
        console.error('[BLING ERROR]', error.response?.data || error.message);

        return res.status(500).json({
            error: 'Erro ao trocar code por token no Bling',
        });
    }
};
