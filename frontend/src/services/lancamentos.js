import { api } from '../api/api'
import { toast } from 'sonner'

// Buscar Lancamentos
export const buscarLancamentos = async () => {

}

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
export const editarLancamento = async () => {

}

// Excluir Lancamento
export const excluirLancamento = async () => {

}