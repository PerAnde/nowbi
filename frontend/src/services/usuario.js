import { api } from "../api/api";
import { toast } from "sonner";

// Buscar Usuario
export const buscarUsuario = async (setUsuario) => {

    try {

        const response = await api.get("/user");
        console.log(response.data)

        setUsuario(response.data)

    } catch (error) {
        toast.error("Erro ao buscar dados do usuário!")
        console.log(error)
    }

}

// Editar Usuario
// export const editarUsuario = async ()