// Importando axios
import axios from 'axios'
import { getUsuarioLocalStorage, logout } from '../contexts/util'

const getToken = () => {

    const usuario = getUsuarioLocalStorage()
    return usuario && usuario.token ? usuario.token : null

}

// Exportando url na const api
export const api = axios.create({
    // Url base do backend
    baseURL: import.meta.env.VITE_API_URL
})

// Toda vez que for feita uma requisicao passa por aqui
api.interceptors.request.use(
    (config) => {
        const token = getToken()

        // Adiciona o token no cabeçalho Authorization se ele estiver presente
        config.headers.Authorization = `Bearer ${token}`;


        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptador de respostas
api.interceptors.response.use(
    (response) => {
        return response; // Retorna a resposta normalmente se não houver erro
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                // Token expirado ou não autorizado
                logout(); // Remove os dados do usuário do localStorage
                window.location.href = '/'; // Redireciona para a página de login
            } else if (status === 403) {
                if (typeof window.setPlanoExpiradoExternamente === 'function') {
                    window.setPlanoExpiradoExternamente(true);
                }
                // Plano expirado ou acesso negado
                // Você pode limpar o localStorage ou manter os dados, depende da sua lógica
                // Exemplo simples de redirecionamento:
                if (window.location.pathname !== '/planos') {
                    window.location.href = '/planos';
                }
            }
        }
        return Promise.reject(error);
    }
);