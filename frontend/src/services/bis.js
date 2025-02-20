import { api } from '../api/api'
import { toast } from 'sonner'

export const buscarBi = async (id, setBi, setLoading, navigate) => {

    try {

        // await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await api.get(`/bi/${id}`);

        if (response.data) {
            setBi(response.data);
            setLoading(false)
        } else {
            setBi(null)
            navigate("/notfound");
        }

    } catch (error) {
        console.log(error);
    }

}

// Criar BI
export const criarBi = async (id, mes, ano) => {
    if (!id) {
        toast.warning("Empresa inválida!")
        return false;
    }

    if (!mes) {
        toast.warning("Selecione um mês!")
        return false;
    }

    if (!ano) {
        toast.warning('Selecione um ano!');
        return false;
    }

    try {

        const data = { mes, ano };
        await api.post(`/bi/${id}`, data);
        toast.success('Bi cadastrado com sucesso!');
        return true;

    } catch (error) {
        toast.error(error.response.data.error);
        return false;
    }
};