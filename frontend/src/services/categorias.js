import { api } from '../api/api'
import { toast } from 'sonner'

// Buscar categorias das empresas para pagina de categorias
export const buscarCategoriasEmpresas = async (setEmpresas, setLoading) => {
    try {
        setLoading(true);
        const response = await api.get('/categorias');

        const empresasOrdenadas = response.data.sort((a, b) => a.name.localeCompare(b.name));

        setEmpresas(empresasOrdenadas);
    } catch (error) {
        toast.error("Erro ao carregar blocos de empresas");
        console.error("Erro ao buscar empresas para categorias", error);
    } finally {
        setLoading(false);
    }
}

// Buscar categorias por empresa para criar ou editar lançamento
export const buscarCategoriasPorEmpresa = async (empresaId, setCategorias, setLoading) => {
    if (!empresaId) return;

    try {
        setLoading(true);
        const response = await api.get(`/categorias/empresa/${empresaId}`);

        const categoriasOrdenadas = response.data.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        setCategorias(categoriasOrdenadas);
    } catch (error) {
        toast.error("Erro ao carregar categorias desta empresa");
        console.error("Erro no buscarCategoriasService:", error);
    } finally {
        setLoading(false);
    }
}

// Criar categoria
export const criarCategoria = async (name, tipo, grupoDre, empresa_id) => {
    if (!name) {
        toast.warning('Preencha o nome da categoria!');
        return false;
    }

    if (!tipo) {
        toast.warning('Por favor, selecione RECEITA ou DESPESA');
        return false;
    }

    if (!empresa_id) {
        toast.error('Ocorreu um erro. Por favor, tente novamente.');
        return false;
    }

    try {
        const data = { name, tipo, grupoDre, empresa_id };
        await api.post('/categorias', data);
        toast.success('Categoria cadastrada com sucesso!');
        return true;  // Indica sucesso
    } catch (error) {
        toast.error(error.response.data.error);
        return false; // Indica erro
    }
};

// Editar categoria
export const editarCategoria = async (name, tipo, categoria, setTrigger, grupoDre, empresa_id) => {

    if (!name) {
        toast.warning("Preencha o nome da categoria!")
        return;
    }

    if (!tipo) {
        toast.warning("Selecione RECEITA ou DESPESA")
        return;
    }

    if (!empresa_id) {
        toast.error('Ocorreu um erro. Por favor, tente novamente.');
        return false;
    }

    try {
        const data = { name, tipo, grupoDre, empresa_id };

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
export const excluirCategoria = async (categoriaId, empresa_id, buscarCategorias, setModalConfirmacao) => {

    try {

        await api.delete(`/categorias/${categoriaId}`, {
            data: { empresa_id }
        });
        setModalConfirmacao(false);
        toast.success("Categoria excluída com sucesso!")
        buscarCategorias();

    } catch (error) {
        toast.error(error.response.data.error)
        console.error("Erro ao excluir a categoria!", error)
    }

};
