import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useAuth } from '../contexts/useAuth'

export const PrivateRoutes = ({ children }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Definição clara: expirou se não tem plano E não está em teste
    const planoExpirado = !auth.isPeriodoTesteAtivo && !auth.isPlanoAtivo;

    useEffect(() => {
        if (!auth.token) {
            navigate("/");
            return;
        }

        // Se expirou e NÃO está na ajuda, manda para ajuda
        if (planoExpirado && location.pathname !== "/ajuda") {
            navigate("/ajuda");
        }
    }, [auth.token, planoExpirado, location.pathname, navigate]);

    // PROTEÇÃO DE RENDERIZAÇÃO
    if (!auth.token) return null;

    // Se expirou e tentar acessar outra coisa, não renderiza nada (o useEffect redirecionará)
    if (planoExpirado && location.pathname !== "/ajuda") {
        return null;
    }

    // Se expirou MAS está na /ajuda, renderiza os children (página de ajuda)
    return children;
}
