import { api } from '../api/api'
import { toast } from 'sonner'
import { format } from 'date-fns';
import { ptBR } from "date-fns/locale";

// Buscar empresas
export const buscarEmpresas = async (setEmpresas, setLoading) => {
    try {

        // await new Promise(resolve => setTimeout(resolve, 5000))

        const response = await api.get("/empresas");

        const ordemAlfabeticaEmpresas = response.data
            .map(empresa => ({
                ...empresa,
                created_at: format(new Date(empresa.created_at), "dd MMM yyyy", { locale: ptBR })
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        setEmpresas(ordemAlfabeticaEmpresas);
        setLoading(false);

    } catch (error) {
        toast.error("Erro ao buscar empresas!");
        console.error("Erro ao buscar empresas:", error);
    } finally {
        setLoading(false);
    }
};


// Buscar Empresa
export const buscarEmpresa = async (id, setEmpresa, setLoading, navigate) => {

    try {

        // await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await api.get(`/empresas/${id}`);

        if (response.data.length > 0) {
            setEmpresa(response.data[0]);
            setLoading(false)
        } else {
            setEmpresa(null)
            navigate("/notfound");
        }

    } catch (error) {
        toast.error("Erro ao buscar dados da empresa!")
        console.log(error);
    }

}

// Criar Empresa
export const criarEmpresa = async (name, cnpjEmpresa, file) => {
    if (!name) {
        toast.warning("Preencha o nome da empresa!");
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('cnpj_empresa', cnpjEmpresa);

        if (file) {
            formData.append('file', file);
        }

        const response = await api.post('/empresas', formData);

        if (response.status >= 200 && response.status < 300) {
            toast.success("Empresa criada com sucesso!");
            return true;
        } else {
            throw new Error("Erro na resposta do servidor!");
        }
    } catch (error) {
        if (error.response) {
            toast.error(`Erro ao criar a empresa: ${error.response.data.message || 'Erro desconhecido'}`);
        } else {
            toast.error("Erro ao criar a empresa! Tente novamente.");
        }

        return false;
    }
};

// Editar Empresa
export const editarEmpresa = async (id, formData) => {
    try {
        await api.put(`/empresas/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        toast.success("Empresa atualizada com sucesso!");
        return true;

    } catch (error) {
        toast.error("Ocorreu um erro ao atualizar a empresa.");
        return false;
    }
};

// Excluir Empresa
export const excluirEmpresa = async (empresaId) => {

    try {

        await api.delete(`/empresas/${empresaId}`);
        toast.success("Empresa excluída com sucesso!")

    } catch (error) {
        toast.error("Erro ao excluir a empresa!")
        console.error("Erro ao excluir a empresa!", error)
    }

}