import { Router } from 'express';

const router = Router();

router.get('/callback', (req, res) => {
    const { code, state } = req.query;

    console.log('[BLING CALLBACK]', { code, state });

    if (!code) {
        return res.status(400).json({ error: 'Code não informado pelo Bling' });
    }

    return res.status(200).json({
        message: 'Callback do Bling recebido com sucesso',
        code,
        state
    });
});

export default router;
