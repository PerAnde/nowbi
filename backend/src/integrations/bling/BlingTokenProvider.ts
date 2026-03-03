import axios from "axios";
import prismaClient from "../../prisma";

class BlingTokenProvider {
    async getValidToken(empresa_id: string): Promise<string> {
        const integracao = await prismaClient.blingIntegration.findUnique({
            where: { empresaId: empresa_id }
        });

        if (!integracao) throw new Error("Integração não encontrada.");

        try {
            // Teste: ver se o token atual funciona
            await axios.get("https://www.bling.com.br/Api/v3/usuarios/me", {
                headers: { Authorization: `Bearer ${integracao.accessToken}` }
            });
            return integracao.accessToken;
        } catch (error) {
            // SE o erro for 401 (expirado), chama o método de renovação
            if (error.response?.status === 401) {
                console.log("Token expirado, tentando renovar...");
                // VOCÊ PRECISA RETORNAR O RESULTADO DA REFRESH TOKEN AQUI:
                return await this.refreshToken(empresa_id, integracao.refreshToken);
            }

            // Se for outro erro (ex: Bling fora do ar), aí sim joga o erro
            console.error("Erro inesperado na validação do token:", error.response?.data || error.message);
            throw new Error("Não foi possível validar o token do Bling.");
        }
    }

    private async refreshToken(empresa_id: string, refreshToken: string): Promise<string> {
        // Substitua pelas suas credenciais do Bling
        const clientId = process.env.BLING_CLIENT_ID;
        const clientSecret = process.env.BLING_CLIENT_SECRET;
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

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

        const { access_token, refresh_token } = response.data;

        await prismaClient.blingIntegration.update({
            where: { empresaId: empresa_id },
            data: {
                accessToken: access_token,
                refreshToken: refresh_token // O Bling também rotaciona o refresh_token!
            }
        });

        return access_token;
    }
}

export { BlingTokenProvider };