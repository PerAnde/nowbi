import { api } from '../api/api'
import { toast } from 'sonner'

// Buscar categorias
export const buscarCategorias = async (filtroAtivo, setCategorias, setLoading) => {

    try {
        setLoading(true);
        const response = await api.get('/categorias', { params: { tipo: filtroAtivo }})
        setCategorias(response.data)
        setLoading(false)
    } catch (error) {
        toast.error("Erro ao buscar categorias")
        console.error("Erro ao buscar categorias", error)
        setLoading(false);
    }

}

// Excluir categorias
export const excluirCategoria = async (categoriaId, buscarCategorias, setModalConfirmacao) => {

    try {
        await api.delete(`/categorias/${categoriaId}`);
        setModalConfirmacao(false);
        toast.success("Categoria excluída com sucesso!")
        buscarCategorias();
    } catch (error){
        toast.error("Erro ao excluir a categoria!")
        console.error("Erro ao excluir a categoria!", error)
    }

};