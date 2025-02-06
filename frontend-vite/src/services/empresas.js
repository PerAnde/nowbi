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