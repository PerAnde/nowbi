import { api } from '../api/api'
import { toast } from 'sonner'

// Buscar categorias
export const buscarCategorias = async (setCategorias, setLoading) => {

    try {

        setLoading(true);

        const response = await api.get('/categorias')

        const ordemAlfabeticaCategorias = response.data.sort((a, b) => a.name.localeCompare(b.name));

        setCategorias(ordemAlfabeticaCategorias);
        setLoading(false)

    } catch (error) {
        toast.error("Erro ao buscar categorias")
        console.error("Erro ao buscar categorias", error)
    } finally {
        setLoading(false);
    }

}

// Criar categoria
export const criarCategoria = async (name, tipo, grupoDre) => {
    if (!name) {
        toast.warning('Preencha o nome da categoria!');
        return false;
    }

    if (!tipo) {
        toast.warning('Por favor, selecione RECEITA ou DESPESA');
        return false;
    }

    try {
        const data = { name, tipo, grupoDre };
        await api.post('/categorias', data);
        toast.success('Categoria cadastrada com sucesso!');
        return true;  // Indica sucesso
    } catch (error) {
        toast.error('Erro ao criar categoria, tente novamente mais tarde!');
        return false; // Indica erro
    }
};

// Editar categoria
export const editarCategoria = async (name, tipo, categoria, setTrigger, grupoDre) => {

    if (!name) {
        toast.warning("Preencha o nome da categoria!")
        return;
    }

    if (!tipo) {
        toast.warning("Selecione RECEITA ou DESPESA")
        return;
    }

    try {
        const data = { name, tipo, grupoDre };

        await api.put(`/categorias/${categoria.id}`, data); // Atualiza a categoria pelo ID
        toast.success("Categoria atualizada com sucesso!")
        setTrigger(false);

        return true;

    } catch (error) {
        toast.error(error.response.data.error)
        return false;
    }

}

// Excluir categorias
export const excluirCategoria = async (categoriaId, buscarCategorias, setModalConfirmacao) => {

    try {

        await api.delete(`/categorias/${categoriaId}`);
        setModalConfirmacao(false);
        toast.success("Categoria excluída com sucesso!")
        buscarCategorias();

    } catch (error) {
        toast.error(error.response.data.error)
        console.error("Erro ao excluir a categoria!", error)
    }

};
