import { api } from '../api/api'
import { toast } from 'sonner'

export const importarArquivo = async (arquivo, businessIntelligenceId) => {
    try {
        const formData = new FormData();

        formData.append('file', arquivo);
        formData.append('businessIntelligenceId', businessIntelligenceId);

        const response = await api.post('/importacao-arquivo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000
        });

        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        throw error.response?.data || new Error("Erro ao processar importação");
    }
};