import { Request, Response } from 'express';

export const testarIntegracaoBling = (req: Request, res: Response) => {
    const { empresaId } = req.query;

    if (!empresaId) {
        return res.status(400).send('empresaId obrigatório');
    }

    const oauthParams = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.BLING_CLIENT_ID!,
        redirect_uri: process.env.BLING_REDIRECT_URI!,
        scope: 'produtos produtos.exclusao produtos.gerenciar',
        state: String(empresaId),
    });

    const oauthUrl =
        `https://www.bling.com.br/Api/v3/oauth/authorize?${oauthParams.toString()}`;

    return res.redirect(
        `https://www.bling.com.br/logout.php?redirect=${encodeURIComponent(oauthUrl)}`
    );
};
