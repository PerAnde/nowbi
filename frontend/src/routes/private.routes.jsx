import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useAuth } from '../contexts/useAuth'

export const PrivateRoutes = ({ children }) => {

    // Chamando arquivo useAuth
    const auth = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const planoExpirado = !auth.isPeriodoTesteAtivo && !auth.isPlanoAtivo;

    useEffect(() => {

        // Verificando se não existe token dentro do Auth e redirecionando para /login
        if (!auth.token) {
            // Se nao existir token dentro do Auth redireciona para /login
            return navigate("/")
        }

        // Se não tiver periodo de teste ou plano ativo redireciona para /planos
        if (planoExpirado && location.pathname !== "/planos") {
            navigate("/planos");
        }

    }, [auth.token, planoExpirado, location.pathname, navigate])

    if (!auth.token || (planoExpirado && location.pathname !== "/planos")) {
        return null
    }

    return children
}
