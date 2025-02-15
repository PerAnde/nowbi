import { api } from '../api/api'
import { toast } from 'sonner'
import { format } from 'date-fns';

// Buscar empresas
export const buscarEmpresas = async (setEmpresas, setLoading) => {

    try {
        // Time para testar Skeletons
        // await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await api.get("/empresas");

        const dataCriacaoEmpresas = response.data.map(empresa => ({
            ...empresa,
            created_at: format(new Date(empresa.created_at), "dd MMM yyyy")
        }))

        setEmpresas(dataCriacaoEmpresas)
        setLoading(false);

    } catch (error) {
        console.log(error)
    }

}

// Buscar Empresa
export const buscarEmpresa = async (id, setEmpresa, setLoading, navigate) => {

    try {

        await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await api.get(`/empresas/${id}`);

        if (response.data.length > 0) {
            setEmpresa(response.data[0]);
            setLoading(false)
        } else {
            setEmpresa(null)
            navigate("/notfound");
        }

    } catch (error) {
        console.log(error);
    }

}

// Criar Empresa

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