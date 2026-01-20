import { Request, Response } from 'express';

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
        scope:'produtos'
    });

    const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?${params.toString()}`;

    return res.redirect(authUrl);
};

export const callbackBling = (req: Request, res: Response) => {
    const { code, state } = req.query;

    console.log('[BLING CALLBACK]', { code, state });

    if (!code) {
        return res.status(400).json({ error: 'Code não informado pelo Bling' });
    }

    return res.status(200).json({
        message: 'Callback do Bling recebido com sucesso',
        code,
        state,
    });
};
