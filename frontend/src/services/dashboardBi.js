import { api } from '../api/api'
import { toast } from 'sonner'

export const buscarDashboardBi = async (link_bi, setEmpresa, setLoading, navigate) => {

    try {

        // await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await api.get(`/dashboardbi/${link_bi}`);

        if (response.data) {
            setEmpresa(response.data);
            setLoading(false);
        } else {
            setEmpresa(null);
            navigate("/notfound");
        }

    } catch (error) {
        toast.error("Erro ao buscar dados da empresa!")
        console.log(error);
    }

}