import { api } from '../api/api';

export async function importacaoBling(empresaId, biId, dataInicial, dataFinal, contasIds) {
    await api.get(`/integrations/bling/sync-categories/${empresaId}`);

    const response = await api.post(`/integrations/bling/sync-caixa/${empresaId}/${biId}`,
        {
            contasIds
        },
        {
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