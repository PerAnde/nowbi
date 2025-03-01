import { api } from '../api/api'
import { toast } from 'sonner'

// Buscar BI
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

// Editar BI
export const editarBi = async (id, mes, ano) => {
    if (!id) {
        toast.warning("BI inválido!")
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
        await api.put(`/bi/${id}`, data);
        toast.success("BI atualizado com sucesso!")
        return true;

    } catch (error) {
        toast.error(error.response.data.error);
        return false;
    }
}

// Ataulizar status bi
export const atualizarStatus = async (id, status) => {
    if (!id) {
        toast.warning("BI inválido!");
        return false;
    }

    try {
        const data = { status };
        await api.put(`/bi/status/${id}`, data);
        toast.success("Status do BI atualizado com sucesso!");
        return true;
    } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao atualizar status");
        return false;
    }
};


// Excluir Bi
export const excluirBi = async (id, idEmpresa, navigate) => {
    if (!id) {
        toast.warning("BI inválido!")
    }

    try {

        await api.delete(`/bi/${id}`);
        toast.success("BI excluído com sucesso!")
        navigate(`/empresas/${idEmpresa}`);
        return true;

    } catch (error) {
        toast.error(error.response.data.error);
        return false;
    }
}
