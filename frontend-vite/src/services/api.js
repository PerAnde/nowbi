// Importando axios
import axios from 'axios'
import { getUsuarioLocalStorage } from '../contexts/util'

// Exportando url na const api
export const api = axios.create({
    // Url base do backend
    baseURL: "http://192.168.1.11:3333"
})

// Toda vez que for feita uma requisicao passa por aqui
api.interceptors.request.use(
    (config) => {
        const usuario = getUsuarioLocalStorage()

        config.headers.Authorization = usuario?.token

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)