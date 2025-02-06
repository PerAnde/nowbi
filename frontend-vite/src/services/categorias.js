import { api } from '../api/api'
import { toast } from 'sonner'

// Buscar categorias
export const buscarCategorias = async (filtroAtivo, setCategorias, setLoading) => {

    try {

        // Time para testar Skeletons
        // await new Promise(resolve => setTimeout(resolve, 2000))

        setLoading(true);

        const response = await api.get('/categorias', { params: { tipo: filtroAtivo } })

        setCategorias(response.data)
        setLoading(false)

    } catch (error) {
        toast.error("Erro ao buscar categorias")
        console.error("Erro ao buscar categorias", error)
        setLoading(false);
    }

}

// Criar categoria
export const criarCategoria = async (name, tipo) => {
    if (!name) {
        toast.warning('Preencha o nome da categoria!');
        return false;
    }

    if (!tipo) {
        toast.warning('Por favor, selecione RECEITA ou DESPESA');
        return false;
    }

    try {
        const data = { name, tipo };
        await api.post('/categorias', data);
        toast.success('Categoria cadastrada com sucesso!');
        return true;  // Indica sucesso
    } catch (error) {
        toast.error('Erro ao criar categoria, tente novamente mais tarde!');
        return false; // Indica erro
    }
};

// Excluir categorias
export const excluirCategoria = async (categoriaId, buscarCategorias, setModalConfirmacao) => {

    try {

        await api.delete(`/categorias/${categoriaId}`);
        setModalConfirmacao(false);
        toast.success("Categoria excluída com sucesso!")
        buscarCategorias();

    } catch (error) {
        toast.error("Erro ao excluir a categoria!")
        console.error("Erro ao excluir a categoria!", error)
    }

};

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