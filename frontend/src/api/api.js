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
    baseURL: "http://192.168.1.9:3333"
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
        if (error.response && error.response.status === 401) {
            // Token expirado ou não autorizado
            logout(); // Remove os dados do usuário do localStorage
            window.location.replace = '/'; // Redireciona para a página de login
        }
        return Promise.reject(error);
    }
);