import { toast } from 'sonner'

export const excluirIntegracao = async (empresaId) => {

    try {

        await api.delete(`/integrations/${empresaId}`);
        if (response.status >= 200 && response.status < 300) {
            toast.success("Integração desfeita com sucesso!");
            return true;
        }

        throw new Error("Erro ao processar exclusão");

    } catch (error) {
        const mensagemErro = error.response?.data?.error || "Erro ao desfazer integração";
        toast.error(mensagemErro);
        console.error("Erro ao desfazer integração:", error);

        return false;
    }

}