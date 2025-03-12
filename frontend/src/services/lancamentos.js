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
export const editarLancamento = async (valor, tipo, categoria, subcategoria, lancamento) => {

    if (!valor) {
        toast.warning("Insira um valor!")
        return;
    }
    if (!tipo) {
        toast.warning("Selecione RECEITA ou DESPESA")
        return;
    }
    if (!categoria) {
        toast.warning("Selecione uma categoria!")
        return;
    }

    try {

        const data = { valor, tipo, categoria, subcategoria }
        await api.put(`/lancamentos/${lancamento.id}`, data);
        toast.success("Lancamento atualizado com sucesso!");
        return true;

    } catch (error) {
        toast.error(error.response.data.error);
        return false;
    }

}

// Excluir Lancamento
export const excluirLancamento = async () => {

}