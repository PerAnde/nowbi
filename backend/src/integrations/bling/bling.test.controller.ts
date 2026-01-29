import { Request, Response } from 'express';

export const testarIntegracaoBling = (req: Request, res: Response) => {
    const { empresaId } = req.query;

    if (!empresaId) {
        return res.status(400).send('empresaId obrigatório');
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.BLING_CLIENT_ID!,
        redirect_uri: process.env.BLING_REDIRECT_URI!,
        state: String(empresaId),
        scope: 'produtos produtos.exclusao produtos.gerenciar',
    });

    const oauthUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?${params.toString()}`;

    return res.send(`
    <html>
      <body>
        <p>Forçando logout do Bling...</p>

        <script>
          // força logout
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = 'https://www.bling.com.br/logout.php';
          document.body.appendChild(iframe);

          // depois vai para o OAuth
          setTimeout(() => {
            window.location.href = '${oauthUrl}';
          }, 800);
        </script>
      </body>
    </html>
  `);
};
