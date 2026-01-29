import axios from 'axios';
import prismaClient from '../../prisma';

interface BlingTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    user_id: string;
}

export class BlingService {

    static async trocarCodePorToken(code: string): Promise<BlingTokenResponse> {
        const clientId = process.env.BLING_CLIENT_ID!;
        const clientSecret = process.env.BLING_CLIENT_SECRET!;
        const redirectUri = process.env.BLING_REDIRECT_URI!;

        const basicAuth = Buffer.from(
            `${clientId}:${clientSecret}`
        ).toString('base64');

        const response = await axios.post<BlingTokenResponse>(
            'https://www.bling.com.br/Api/v3/oauth/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
            {
                headers: {
                    Authorization: `Basic ${basicAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data;
    }

    static async salvarIntegracao(params: {
        empresaId: string;
        tokenData: BlingTokenResponse;
    }) {
        const { empresaId, tokenData } = params;

        const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

        return prismaClient.blingIntegration.upsert({
            where: { empresaId },
            create: {
                empresaId,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                scope: tokenData.scope,
                blingUserId: tokenData.user_id,
                expiresAt,
                isActive: true,
            },
            update: {
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                scope: tokenData.scope,
                blingUserId: tokenData.user_id,
                expiresAt,
                isActive: true,
            }
        })
    }
}
