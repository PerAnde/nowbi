import { api } from '../api/api';

export async function importacaoBling(empresaId, biId, dataInicial, dataFinal) {
    await api.post(`/integrations/bling/sync-categories/${empresaId}`);

    const response = await api.post(`/integrations/bling/sync-caixa/${empresaId}/${biId}`, {
        dataInicial,
        dataFinal
    });

    return response.data;
}