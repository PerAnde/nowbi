import axios, { AxiosRequestConfig } from 'axios';
import prismaClient from '../../prisma';

const api = axios.create({
    baseURL: 'https://api.bling.com.br/Api/v3/homologacao',
});

export class BlingHomologacaoService {
    static async executar(integracao: {
        id: string;
        accessToken: string;
        refreshToken: string;
    }) {
        let accessToken = integracao.accessToken;
        let homologacaoHash: string | undefined;

        const request = async (config: AxiosRequestConfig) => {
            try {
                const response = await api.request({
                    ...config,
                    headers: {
                        ...(config.headers || {}),
                        Authorization: `Bearer ${accessToken}`,
                        ...(homologacaoHash && {
                            'x-bling-homologacao': homologacaoHash,
                        }),
                    },
                });

                homologacaoHash = response.headers['x-bling-homologacao'];
                return response;
            } catch (error: any) {
                if (
                    error.response?.data?.error?.type === 'invalid_token'
                ) {
                    accessToken = await this.refreshToken(integracao);
                    return request(config); // repete exatamente a mesma request
                }

                throw error;
            }
        };

        /** STEP 1 – GET */
        const getProduto = await request({
            method: 'GET',
            url: '/produtos',
        });

        const produto = getProduto.data.data;

        /** STEP 2 – POST */
        const postProduto = await request({
            method: 'POST',
            url: '/produtos',
            data: {
                nome: produto.nome,
                preco: produto.preco,
                codigo: produto.codigo,
            },
        });

        const produtoId = postProduto.data.data.id;

        /** STEP 3 – PUT */
        await request({
            method: 'PUT',
            url: `/produtos/${produtoId}`,
            data: {
                nome: 'Copo',
                preco: produto.preco,
                codigo: produto.codigo,
            },
        });

        /** STEP 4 – PATCH */
        await request({
            method: 'PATCH',
            url: `/produtos/${produtoId}/situacoes`,
            data: {
                situacao: 'I',
            },
        });

        /** STEP 5 – DELETE */
        await request({
            method: 'DELETE',
            url: `/produtos/${produtoId}`,
        });

        return { success: true };
    }

    private static async refreshToken(integracao: {
        id: string;
        refreshToken: string;
    }) {
        const response = await axios.post(
            'https://api.bling.com.br/Api/v3/oauth/token',
            null,
            {
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: integracao.refreshToken,
                },
                auth: {
                    username: process.env.BLING_CLIENT_ID!,
                    password: process.env.BLING_CLIENT_SECRET!,
                },
            }
        );

        const { access_token, refresh_token } = response.data;

        await prismaClient.blingIntegration.update({
            where: { id: integracao.id },
            data: {
                accessToken: access_token,
                refreshToken: refresh_token,
            },
        });

        return access_token;
    }
}
