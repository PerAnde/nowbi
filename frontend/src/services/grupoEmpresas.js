import { api } from '../api/api'
import { toast } from 'sonner'

// Criar Grupo
export const criarGrupoEmpresa = async (name, emailGrupo) => {

    if (!name) {
        toast.warning("Insira um nome para o grupo!")
        return false;
    }
    if (!emailGrupo) {
        toast.warning("Insira um email para o grupo!")
        return false;
    }

    try {

        const data = {
            name: name,
            email_grupo: emailGrupo,
        };

        await api.post("/empresas/grupo", data)
        toast.success("Grupo criado com sucesso!")

        return true;

    } catch (error) {
        toast.error("Erro ao criar grupo!")
        return false;
    }

}

// Buscar Grupos
export const buscarGrupos = async (setGrupos) => {

    try {

        const response = await api.get('/empresas/grupos')
        setGrupos(response.data)

    } catch (error) {
        toast.error("Erro ao buscar os grupos!")
        console.error("Erro ao buscar os grupos!", error)
    }

}

export const buscarGrupo = async (grupoSelecionado, setGrupo) => {

    try {

        const response = await api.get(`/empresas/grupo/${grupoSelecionado}`)
        setGrupo(response.data);

    } catch (error) {
        toast.error("Erro ao buscar o grupo!")
        console.error("Erro ao buscar o grupo!", error)
    }

}