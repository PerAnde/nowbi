import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.bling.com.br/Api/v3/homologacao',
});

export class BlingHomologacaoService {

    static async executar(accessToken: string) {

        let homologacaoHash: string | undefined;

        const getProduto = await api.get('/produtos', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        homologacaoHash = getProduto.headers['x-bling-homologacao'];

        const produto = getProduto.data.data;

        const postProduto = await api.post(
            '/produtos',
            produto,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'x-bling-homologacao': homologacaoHash,
                },
            }
        );

        homologacaoHash = postProduto.headers['x-bling-homologacao'];

        const produtoId = postProduto.data.data.id;

        const putProduto = await api.put(
            `/produtos/${produtoId}`,
            {
                nome: 'Copo',
                preco: produto.preco,
                codigo: produto.codigo,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'x-bling-homologacao': homologacaoHash,
                },
            }
        );

        homologacaoHash = putProduto.headers['x-bling-homologacao'];

        await api.patch(
            `/produtos/${produtoId}/situacoes`,
            { situacao: 'I' },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'x-bling-homologacao': homologacaoHash,
                },
            }
        );

        return { success: true };
    }
}
