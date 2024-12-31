import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useAuth } from '../contexts/useAuth'

export const PrivateRoutes = ({ children }) => {

    // Chamando arquivo useAuth
    const auth = useAuth()

    const navigate = useNavigate()

    useEffect(() => {

        // Verificando se não existe token dentro do Auth e redirecionando para /login
        if (!auth.token) {

            // Se nao existir token dentro do Auth redireciona para /login
            return navigate("/login")

        }

    }, [auth.token, navigate])


    return children
}
