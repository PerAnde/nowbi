import { api } from '../api/api'
import { toast } from 'sonner'

// Buscar categoria
export const buscarSubcategorias = async (id, setSubcategorias, setLoadingSubcategorias) => {

    try {

        // Time para testar Skeletons
        // await new Promise(resolve => setTimeout(resolve, 2000))
        if (!id) return;

        setLoadingSubcategorias(true);

        const response = await api.get(`/categorias/${id}`)

        if (response.data.length > 0) {
            setSubcategorias(response.data[0].subcategorias);
            setLoadingSubcategorias(false);
        } else {
            setSubcategorias(null);
        }

    } catch (error) {
        toast.error("Erro ao buscar categoria")
        console.error("Erro ao buscar categoria", error)
    } finally {
        setLoadingSubcategorias(false);
    }

}

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