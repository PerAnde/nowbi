// Importando api do backend
import { useNavigate } from 'react-router-dom'
import { api } from "../services/api"

// Funcao para salvar dados do usuario no localStorage
export function setUsuarioLocalStorage(token) {
    //  Armazenando dados do usuario no localStorage
    localStorage.setItem('token', JSON.stringify(token))
}

// Pegando informacoes
export function getUsuarioLocalStorage() {
    const json = localStorage.getItem('token')

    // Se nao existir um json retorna null
    if (!json) {
        return null
    }

    // Se existir retorna uma const usuario a const json
    const usuario = JSON.parse(json)

    // Retornando usuario
    return usuario ?? null
}

export function logout() {
    localStorage.removeItem('token')

    // // Chamando history para redirecionar para outra pagina
    const navigate = useNavigate()

    navigate("/")
}

// Criando e exportando funcao para fazer o login   
export async function LoginRequest(email, password) {
    try {
        // Fazendo requisicao na api do backend passando email e password
        const request = await api.post('login', { email, password })

        // Se der certo retorna os dados
        return request.data

    } catch (error) {
        // Se der erro retorna null
        console.log(error)
        return null
    }
}

export async function SignUpRequest(name, email, cpf_cnpj, password) {

    try {

        const request = await api.post('register', { name, email, cpf_cnpj, password })

        return request.data

    } catch (error) {
        console.log(error)
        return null
    }

}