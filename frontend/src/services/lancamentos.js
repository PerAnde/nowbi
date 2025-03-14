import { api } from '../api/api'
import { toast } from 'sonner'

// Criar Lancamento
export const criarLancamento = async (id, valor, tipo, categoria, subcategoria) => {

    if (!id) {
        toast.warning("BI Inválido!")
        return false;
    }

    if (!valor) {
        toast.warning("Insira um valor!")
        return false;
    }

    if (!tipo) {
        toast.warning("Selecione RECEITA ou DESPESA!")
        return false;
    }

    if (!categoria) {
        toast.warning("Selecione uma categoria!")
        return false;
    }

    try {

        const data = { valor, tipo, categoria, subcategoria };
        await api.post(`/lancamentos/${id}`, data);
        toast.success("Lancamento criado com sucesso!");
        return true;

    } catch (error) {
        toast.error(error.response.data.error);
        return false;
    }

}

// Editar Lancamento
export const editarLancamento = async (valorNumerico, tipo, categoriaSelecionada, subcategoriaSelecionada, lancamento) => {
    if (!valorNumerico) {
        toast.warning("Insira um valor!");
        return;
    }
    if (!tipo) {
        toast.warning("Selecione RECEITA ou DESPESA");
        return;
    }
    if (!categoriaSelecionada) {
        toast.warning("Selecione uma categoria!");
        return;
    }

    try {
        const data = {
            valor: valorNumerico,
            tipo,
            categoria: categoriaSelecionada.id,
            subcategoria: subcategoriaSelecionada?.id ? String(subcategoriaSelecionada.id) : null,
        };

        if (!subcategoriaSelecionada) {
            delete data.subcategoria;
        }

        console.log(data)

        await api.put(`/lancamentos/${lancamento.id}`, data);
        toast.success("Lançamento atualizado com sucesso!");
        return true;
    } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao atualizar lançamento");
        return false;
    }
};


// Excluir Lancamento
export const excluirLancamento = async (lancamentoId, setExclusaoLancamento) => {

    try {
        const response = await api.delete(`/lancamentos/${lancamentoId}`);
        if (response.status !== 200 && response.status !== 204) {
            throw new Error("Ocorreu algum erro na exclusão!");
        }
        setExclusaoLancamento(false);
        toast.success("Lançamento excluído com sucesso!");

    } catch (error) {
        console.error("Erro ao excluir o lançamento!", error);

        if (error.response && error.response.data && error.response.data.error) {
            toast.error(error.response.data.error);
        } else {
            toast.error("Erro ao excluir o lançamento! Tente novamente.");
        }
    }
}