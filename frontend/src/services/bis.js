import { api } from '../api/api'
import { toast } from 'sonner'

// Buscar BI
export const buscarBi = async (id, pagina, setBi, setLoading, navigate) => {
    if (typeof setLoading === 'function') setLoading(true);



    try {
        const response = await api.get(`/bi/${id}`, {
            params: { pagina: pagina }
        });

        if (response.data) {
            setBi(response.data);
        } else {
            setBi(null);
            if (typeof navigate === 'function') navigate("/notfound");
        }

    } catch (error) {
        console.error("Erro ao buscar BI:", error);
    } finally {
        if (typeof setLoading === 'function') setLoading(false);
    }
}

// Criar BI
export const criarBi = async (id, mesSelecionado, anoSelecionado) => {
    if (!id) {
        toast.warning("Empresa inválida!")
        return false;
    }

    if (!mesSelecionado) {
        toast.warning("Selecione um mês!")
        return false;
    }

    if (!anoSelecionado) {
        toast.warning('Selecione um ano!');
        return false;
    }

    try {

        const mes = mesSelecionado;
        const ano = anoSelecionado;

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

export const gerarRelatorioAI = async (bi_id) => {
    const response = await api.post(`/bi/${bi_id}/gerar-relatorio`);
    return response.data;
};

export const buscarObservacoes = async (id) => {
    try {
        const response = await api.get(`/observacoes/${id}`);
        return response.data; // pode ser null
    } catch (error) {
        console.error("Erro ao buscar observações do BI:", error);
        return null;
    }
};

export const salvarObservacoes = async (id, observacoes) => {
    try {
        await api.put(`/observacoes/${id}`, { ...observacoes });
        return true;
    } catch (error) {
        console.error("Erro ao salvar observações do BI:", error);
        return false;
    }
}

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
