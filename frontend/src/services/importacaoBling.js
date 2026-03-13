import { api } from '../api/api';

export async function importacaoBling(empresaId, biId, dataInicial, dataFinal) {
    await api.get(`/integrations/bling/sync-categories/${empresaId}`);

    const response = await api.get(`/integrations/bling/sync-caixa/${empresaId}/${biId}`, {
        params: {
            pagina: 1,
            dataInicial,
            dataFinal,
            situacaoConciliacao: 1,
            situacao: 'R'
        }
    });

    return response.data;
}