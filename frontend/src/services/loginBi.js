import { api } from '../api/api'

export const validarPinBi = async (link_bi, pin_acesso) => {
    try {
        const response = await api.post(`/empresas/${link_bi}/validar-pin`, {
            pin_acesso
        });
        return response.data; // { valido: true/false }
    } catch (error) {
        console.error('Erro na API de validar PIN:', error);
        throw error;
    }
};

export const buscarPin = async (id) => {
    const response = await api.get(`/empresas/${id}/pin`);
    return response.data;
};

// Atualizar PIN
export const atualizarPin = async (id, pin) => {
    const response = await api.patch(`/empresas/${id}/pin`, { pin_acesso: pin });
    return response.data;
};