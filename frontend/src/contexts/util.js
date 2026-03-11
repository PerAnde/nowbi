import { api } from "../api/api"
import { toast } from "sonner"

export function setUsuarioLocalStorage(user) {
    localStorage.setItem('user', JSON.stringify(user))
}

export function getUsuarioLocalStorage() {
    const json = localStorage.getItem('user')
    if (!json) {
        return null
    }
    const usuario = JSON.parse(json)
    return usuario ?? null
}

export function logout() {
    localStorage.removeItem('user')

    window.location.replace('/');
}

export async function LoginRequest(email, password) {
    try {
        const request = await api.post('login', { email, password })
        return request.data
    } catch (error) {
        toast.error(error.response.data.error)
        return null
    }
}

export async function SignUpRequest(name, email, cpf_cnpj, password) {

    try {
        const request = await api.post('register', { name, email, cpf_cnpj, password })
        toast.success("Conta criada com sucesso, seja bem vindo!")
        return request.data

    } catch (error) {
        toast.error(error.response.data.error)
        throw new Error(error.response.data.error)
    }

}

export async function RequestPasswordRecovery(email) {
    try {
        const request = await api.post('password/recovery', { email });
        toast.success("Se o e-mail estiver cadastrado, um link foi enviado!");
        return request.data;
    } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao solicitar recuperação");
        return null;
    }
}

export async function ResetPasswordRequest(email, token, newPassword) {
    try {
        const request = await api.post('password/reset', {
            email,
            token,
            newPassword
        });
        toast.success("Senha alterada com sucesso!");
        return request.data;
    } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao redefinir senha");
        throw new Error(error.response?.data?.error);
    }
}