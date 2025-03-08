import { api } from '../api/api'
import { toast } from 'sonner'

// Criar subcategoria
export const criarSubcategoria = async (name, categoriaId) => {
    if (!name) {
        toast.warning("Preencha o nome da categoria!");
        return false;
    }

    if (!categoriaId) {
        toast.warning("ID da categoria não encontrado!")
        return false;
    }

    try {

        const data = {
            name: name,
            categoria_id: categoriaId,
        };
        await api.post('/subcategorias', data);
        toast.success("Subcategoria criada com sucesso!");

        return true;  // Indica sucesso

    } catch (error) {

        toast.error("Erro ao criar subcategoria!")
        return false; // Indica erro
    }

};

// Editar subcategoria
export const editarSubcategoria = async (name, subcategoria, setTrigger) => {

    if (!name) {
        toast.warning("Preencha o nome da subcategoria!")
        return;
    }

    try {

        await api.put(`/subcategorias/${subcategoria.id}`, { name });
        toast.success("Subcategoria atualizada com sucesso!")
        setTrigger(false);

        return true;

    } catch (error) {
        toast.error("Erro ao atualizar a subcategoria!")
        return false;
    }

}

// Excluir subcategorias
export const excluirSubcategoria = async (categoriaId, buscarCategorias, setModalConfirmacaoSubcategoria) => {

    try {

        await api.delete(`/subcategorias/${categoriaId}`);
        setModalConfirmacaoSubcategoria(false);
        toast.success("Subcategoria excluída com sucesso!")
        buscarCategorias();

    } catch (error) {
        toast.error("Erro ao excluir a subcategoria!")
        console.error("Erro ao excluir a subcategoria!", error)
    }

};