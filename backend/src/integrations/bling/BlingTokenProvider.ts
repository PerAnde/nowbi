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
            await axios.get("https://www.bling.com.br/Api/v3/categorias/receitas-despesas?limite=1", {
                headers: { Authorization: `Bearer ${integracao.accessToken}` }
            });
            return integracao.accessToken;
        } catch (error: any) {

            const status = error.response?.status;

            // SE o erro for 401 (expirado), chama o método de renovação
            if (status === 401) {
                console.log("Token expirado (401), tentando renovar...");
                return await this.refreshToken(empresa_id, integracao.refreshToken);
            }

            if (status === 403) {
                console.warn("Aviso: Token válido, mas acesso negado (403). Verifique escopos e permissões no Bling.");
                return integracao.accessToken; 
            }

            // Se for outro erro (ex: Bling fora do ar), aí sim joga o erro
            console.error("Erro inesperado na validação do token:", error.response?.data || error.message);
            throw new Error("Erro de comunicação com o Bling.");
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