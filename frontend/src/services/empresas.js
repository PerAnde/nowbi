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
export const criarEmpresa = async (name, cnpjEmpresa, emailAutenticaBi, file) => {
    if (!name) {
        toast.warning("Preencha o nome da empresa!");
        return false;
    }

    if (!cnpjEmpresa) {
        toast.warning("Preencha o CNPJ da empresa!");
        return false;
    }

    // if (!emailAutenticaBi) {
    //     toast.warning("Preencha o email da empresa!");
    //     return false;
    // }

    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('cnpj_empresa', cnpjEmpresa);
        formData.append('email_empresa', emailAutenticaBi);

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
            toast.error(`${error.response.data.error || 'Erro desconhecido'}`);
        } else {
            toast.error("Erro ao criar a empresa! Tente novamente.");
        }

        return false;
    }
};

// Editar Empresa
export const editarEmpresa = async (id, name, cnpjEmpresa, emailAutenticaBi, file) => {

    try {

        const formData = new FormData();

        // Adiciona os dados básicos
        formData.append('name', name);
        formData.append('cnpj_empresa', cnpjEmpresa);
        formData.append('email_empresa', emailAutenticaBi);

        if (file) {
            formData.append('file', file);
        }

        await api.put(`/empresas/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        toast.success("Empresa atualizada com sucesso!");
        return true;

    } catch (error) {
        toast.error(error.response.data.error);
        return false;
    }
};

// Atualizar configuracoes
export const atualizarConfigDashboardBI = async (empresaId, config) => {
    try {
        await api.patch(`/empresas/${empresaId}/config-dashboard`, config);
        toast.success("Configurações do Dashboard atualizadas!");
        return true;
    } catch (error) {
        toast.error("Erro ao salvar configurações do Dashboard!");
        console.error("Erro ao atualizar config do BI:", error);
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