import { Request, Response } from 'express';

export const telaIntegracaoBling = (req: Request, res: Response) => {
  const { empresaId } = req.query;

  if (!empresaId) {
    return res.status(400).send('empresaId obrigatório');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.BLING_CLIENT_ID!,
    redirect_uri: process.env.BLING_REDIRECT_URI!,
    scope: 'produtos produtos.exclusao produtos.gerenciar',
    state: String(empresaId),
  });

  const oauthUrl =
    `https://www.bling.com.br/Api/v3/oauth/authorize?${params.toString()}`;

  return res.send(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Integração com Bling</title>
      </head>
      <body style="font-family: system-ui; padding: 32px; max-width: 520px">
        <h2>Integração com o Bling</h2>

        <p>
          Antes de continuar, desconecte-se de qualquer conta do Bling
          para evitar integrações entre empresas erradas.
        </p>

        <div style="margin-top: 24px">
          <a href="https://www.bling.com.br/logout.php" target="_blank">
            <button style="padding: 10px 16px">
              Sair do Bling
            </button>
          </a>
        </div>

        <div style="margin-top: 24px">
          <a href="${oauthUrl}">
            <button style="padding: 10px 16px">
              Continuar integração
            </button>
          </a>
        </div>
      </body>
    </html>
  `);
};
