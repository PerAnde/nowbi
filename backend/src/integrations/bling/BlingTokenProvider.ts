import axios from "axios";
import prismaClient from "../../prisma";

class BlingTokenProvider {
    async getValidToken(empresa_id: string): Promise<string> {
        const integracao = await prismaClient.blingIntegration.findUnique({
            where: { empresaId: empresa_id }
        });

        if (!integracao) throw new Error("Integração não encontrada.");

        // Verificamos se o token expira nos próximos 5 minutos (margem de segurança)
        const agora = new Date();
        const cincoMinutosDepois = new Date(agora.getTime() + 5 * 60 * 1000);

        if (integracao.expiresAt > cincoMinutosDepois) {
            // Token ainda é válido e está longe de expirar. Retornamos sem chamar a API do Bling.
            return integracao.accessToken;
        }

        // Se chegou aqui, o token expirou ou está prestes a expirar
        console.log(`[Bling] Token expirado ou próximo do fim. Renovando para empresa ${empresa_id}...`);
        return await this.refreshToken(empresa_id, integracao.refreshToken);
    }

    private async refreshToken(empresa_id: string, refreshToken: string): Promise<string> {
        const clientId = process.env.BLING_CLIENT_ID;
        const clientSecret = process.env.BLING_CLIENT_SECRET;
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        try {
            const response = await axios.post('https://www.bling.com.br/Api/v3/oauth/token',
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );

            const { access_token, refresh_token, expires_in } = response.data;

            // Calculamos a nova data de expiração
            const expiresAt = new Date(new Date().getTime() + (expires_in * 1000));

            await prismaClient.blingIntegration.update({
                where: { empresaId: empresa_id },
                data: {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresAt: expiresAt // Salvamos para a próxima verificação
                }
            });

            return access_token;

        } catch (error: any) {
            console.error("Erro ao renovar token Bling:", error.response?.data || error.message);
            throw new Error("Falha na renovação da integração com Bling. Refaça a conexão.");
        }
    }
}

export { BlingTokenProvider };