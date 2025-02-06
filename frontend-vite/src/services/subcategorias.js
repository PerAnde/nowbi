import { api } from '../api/api'
import { toast } from 'sonner'

// Criar categoria
export const criarSubcategoria = async (name, categoriaId) => {
    if (!name) {
        toast.warning("Preencha o nome da categoria!");
        return false;
    }

    if (!categoriaId) {
        toast.warning("ID da categoria não encontrado!")
        return false;
    }

    console.log("Enviando para API:", { name, categoriaId });

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