import { api } from "../api/api";
import { toast } from "sonner";
import { getUsuarioLocalStorage } from "../contexts/util";

// Buscar Usuario
export const buscarUsuario = async (setUsuario, setLoading) => {

    try {

        // await new Promise(resolve => setTimeout(resolve, 5000))

        const token = getUsuarioLocalStorage();

        if (!token) {
            toast.error("Usuário não autenticado!");
            return;
        }

        const response = await api.get("/user", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setUsuario(response.data)
        setLoading(false);

    } catch (error) {
        setLoading(false);
        toast.error("Erro ao buscar dados do usuário!")
        console.log(error)
    }

}

// Editar Usuario
export const editarUsuario = async (id, formData) => {

    try {

        await api.put(`/user/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })

        toast.success("Dados alterados com sucesso!");
        return true;

    } catch (error) {
        console.error("Erro na requisição:", error.response?.data || error.message);
        toast.error(error.response.data.error)
        return false;
    }

}