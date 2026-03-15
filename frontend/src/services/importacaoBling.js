import { api } from '../api/api';

export async function sincronizarCategoriasBling(empresaId) {
    return await api.get(`/integrations/bling/sync-categories/${empresaId}`);
}

export async function importacaoBling(empresaId, biId, dataInicial, dataFinal, contasIds) {
    const response = await api.post(`/integrations/bling/sync-caixa/${empresaId}/${biId}`,
        { contasIds },
        {
            params: {
                pagina: 1,
                dataInicial,
                dataFinal,
                situacao: 'R'
            }
        });

    return response.data;
}