import axios, { AxiosRequestConfig } from 'axios';
import prismaClient from '../../prisma';
import qs from 'qs';

const api = axios.create({
    baseURL: 'https://api.bling.com.br/Api/v3/homologacao',
    timeout: 5000,
});

export class BlingHomologacaoService {
    static async executar(integracao: { id: string; accessToken: string; refreshToken: string }) {
        let currentAccessToken = integracao.accessToken;
        let currentRefreshToken = integracao.refreshToken;
        let homologacaoHash: string | undefined;

        const logger = (step: string, details: any) => {
            console.log(`\x1b[34m[BLING-STEP: ${step}]\x1b[0m`, JSON.stringify(details, null, 2));
        };

        const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const request = async (config: AxiosRequestConfig): Promise<any> => {
            try {
                await wait(350);

                const response = await api.request({
                    ...config,
                    headers: {
                        ...config.headers,
                        'Authorization': `Bearer ${currentAccessToken}`,
                        ...(homologacaoHash && { 'x-bling-homologacao': homologacaoHash }),
                    },
                });

                homologacaoHash = response.headers['x-bling-homologacao'];
                return response;
            } catch (error: any) {
                const errorType = error.response?.data?.error?.type;
                
                if (error.response?.status === 401 || errorType === 'invalid_token') {
                    console.warn('refresh requisitado');
                    
                    const tokens = await BlingHomologacaoService.refreshToken(integracao.id, currentRefreshToken);
                    
                    currentAccessToken = tokens.access_token;
                    currentRefreshToken = tokens.refresh_token;
                    
                    return request(config); 
                }

                logger('FAILED', {
                    url: config.url,
                    method: config.method,
                    status: error.response?.status,
                    data: error.response?.data,
                    sentHash: homologacaoHash
                });
                throw error;
            }
        };

        try {
            const res1 = await request({ method: 'GET', url: '/produtos' });
            const produtoBase = res1.data.data;
            logger('1-GET-SUCCESS', { hash: homologacaoHash });

            const res2 = await request({
                method: 'POST',
                url: '/produtos',
                data: {
                    nome: produtoBase.nome,
                    preco: produtoBase.preco,
                    codigo: produtoBase.codigo,
                },
            });
            const produtoId = res2.data.data.id;
            logger('2-POST-SUCCESS', { produtoId, hash: homologacaoHash });

            await request({
                method: 'PUT',
                url: `/produtos/${produtoId}`,
                data: {
                    nome: 'Copo',
                    descricao: 'Copo', 
                    preco: produtoBase.preco,
                    codigo: produtoBase.codigo,
                },
            });
            logger('3-PUT-SUCCESS', { hash: homologacaoHash });

            await request({
                method: 'PATCH',
                url: `/produtos/${produtoId}/situacoes`,
                data: { situacao: 'I' },
            });
            logger('4-PATCH-SUCCESS', { hash: homologacaoHash });

            await request({
                method: 'DELETE',
                url: `/produtos/${produtoId}`,
            });
            logger('5-DELETE-SUCCESS', { finalHash: homologacaoHash });

            return { success: true };

        } catch (error) {
            console.error('\x1b[31m[ERRO NA SEQUÊNCIA DE HOMOLOGAÇÃO]\x1b[0m');
            throw error;
        }
    }

    private static async refreshToken(id: string, refreshToken: string) {
        try {
            const response = await axios.post(
                'https://api.bling.com.br/Api/v3/oauth/token',
                qs.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    auth: {
                        username: process.env.BLING_CLIENT_ID!,
                        password: process.env.BLING_CLIENT_SECRET!,
                    },
                }
            );

            const { access_token, refresh_token } = response.data;

            await prismaClient.blingIntegration.update({
                where: { id },
                data: {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                },
            });

            return { access_token, refresh_token };
        } catch (error: any) {
            console.error('Erro ao renovar token:', error.response?.data || error.message);
            throw new Error('Falha no Refresh Token durante a homologação');
        }
    }
}