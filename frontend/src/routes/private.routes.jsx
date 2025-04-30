import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useAuth } from '../contexts/useAuth'

export const PrivateRoutes = ({ children }) => {

    // Chamando arquivo useAuth
    const auth = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {

        // Verificando se não existe token dentro do Auth e redirecionando para /login
        if (!auth.token) {
            // Se nao existir token dentro do Auth redireciona para /login
            navigate("/")
            return
        }

        // Se não tiver periodo de teste ou plano ativo redireciona para /planos
        if (auth.isPeriodoTesteAtivo === false && auth.isPlanoAtivo === false && location.pathname !== "/planos") {
            navigate("/planos")
            return
        }

    }, [auth.token, auth.isPeriodoTesteAtivo, auth.isPlanoAtivo, location.pathname, navigate])

    if (!auth.token || (!auth.isPeriodoTesteAtivo && !auth.isPlanoAtivo && location.pathname !== "/planos")) {
        return null
    }

    return children
}
