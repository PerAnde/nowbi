import { api } from "../api/api";
import { toast } from "sonner";
import { getUsuarioLocalStorage } from "../contexts/util";

// Buscar Usuario
export const buscarUsuario = async (setUsuario, setLoading) => {
    try {
        const usuarioLocal = getUsuarioLocalStorage();

        if (!usuarioLocal || !usuarioLocal.token) {
            toast.error("Usuário não autenticado!");
            return;
        }

        const response = await api.get("/user", {
            headers: {
                Authorization: `Bearer ${usuarioLocal.token}`
            }
        });

        setUsuario(response.data);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            const dadosSalvos = getUsuarioLocalStorage();
            if (dadosSalvos) {
                setUsuario(dadosSalvos);
            }
        } else {
            toast.error("Erro ao buscar dados do usuário!");
        }
    } finally {
        setLoading(false);
    }
}

export const buscarUsuarioStatus = async (setUsuario, setLoading) => {
    try {
        const usuarioLocal = getUsuarioLocalStorage();

        if (!usuarioLocal || !usuarioLocal.token) {
            toast.error("Usuário não autenticado!");
            return;
        }

        const response = await api.get("/user/status", {
            headers: {
                Authorization: `Bearer ${usuarioLocal.token}`
            }
        });

        setUsuario(response.data);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            const dadosSalvos = getUsuarioLocalStorage();
            if (dadosSalvos) {
                setUsuario(dadosSalvos);
            }
        } else {
            toast.error("Erro ao buscar dados do usuário!");
        }
    } finally {
        setLoading(false);
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