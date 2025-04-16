import { api } from '../api/api'
import { toast } from 'sonner'

// Criar Grupo
export const criarGrupoEmpresa = async (name, emailGrupo) => {

    if (!name) {
        toast.warning("Insira um nome para o grupo!")
        return false;
    }
    // if (!emailGrupo) {
    //     toast.warning("Insira um email para o grupo!")
    //     return false;
    // }

    try {

        const data = {
            name: name,
            // email_grupo: emailGrupo,
        };

        await api.post("/empresas/grupo", data)
        toast.success("Grupo criado com sucesso!")

        return true;

    } catch (error) {
        toast.error(error.response.data.error)
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

// Buscar grupo
export const buscarGrupo = async (grupoSelecionado, setGrupo) => {

    try {

        const response = await api.get(`/empresas/grupo/${grupoSelecionado}`)
        setGrupo(response.data);

    } catch (error) {
        toast.error("Erro ao buscar o grupo!")
        console.error("Erro ao buscar o grupo!", error)
    }

}

// Editar grupo
export const editarGrupo = async (id, name, emailGrupo, setTrigger) => {

    try {

        const data = {
            name: name,
            // email_grupo: emailGrupo,
        }

        await api.put(`/empresas/grupo/${id}`, data)
        toast.success("Grupo atualizado com sucesso!")
        setTrigger(false);

        return true;

    } catch (error) {
        toast.error("Erro ao atualizar o grupo!")
        console.error("Erro ao atualizar o grupo!", error)
    }

}

// Adicionar empresa ao grupo
export const atualizarEmpresaNoGrupo = async (grupoId, empresaId, acao, setTrigger) => {
    try {

        const data = {
            empresa_id: empresaId,
            acao: acao
        }

        await api.patch(`/empresas/grupo/${grupoId}`, data);
        toast.success(`Empresa ${acao === "adicionar" ? "adicionada" : "removida"} com sucesso!`);
        setTrigger(false)

    } catch (error) {
        console.error("Erro na requisição:", error); // Para depuração

        if (error.response) {
            toast.error(error.response.data?.error || "Erro desconhecido no servidor.");
        } else if (error.request) {
            toast.error("Erro na comunicação com o servidor.");
        } else {
            toast.error("Ocorreu um erro inesperado.");
        }

        return false;
    }
};


// Excluir grupo
export const excluirGrupo = async (grupoSelecionado) => {

    try {

        await api.delete(`/empresas/grupo/${grupoSelecionado}`);
        toast.success("Grupo excluído com sucesso!")

    } catch (error) {
        toast.error("Erro ao excluir o grupo!")
        console.error("Erro ao excluir o grupo!", error)
    }

}