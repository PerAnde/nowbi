// Importando createContext
import { createContext, useEffect, useState } from "react";

//Iportanod funcao de login para ser usada na funcao Autenticacao
import { LoginRequest, SignUpRequest, getUsuarioLocalStorage, setUsuarioLocalStorage } from './util'

// Exportando AuthContext para ser usado nos arquivos
export const AuthContext = createContext({})

// Exportando AuthProvider que ficara em volta de toda a aplicacao
export const AuthProvider = ({ children }) => {
    // Criando state para armazenar os dados do usuario
    // Inicialmente o state fica como nulo
    const [usuario, setUsuario] = useState(getUsuarioLocalStorage() || null)

    // Quando o provider for chamado, ou seja quando a aplicacao no cliente for iniciada, o useEffect busca os dados salvos no localStorage
    useEffect(() => {
        // Busca o dados no localStorage e armazena na const usuario
        const pegarUsuario = getUsuarioLocalStorage()

        // Se o dados for valido entao seta a variavel usuario com o valor
        if (pegarUsuario) {
            setUsuario(pegarUsuario)
        }
    }, [])

    // Funcao de autenticacao
    async function autenticacao(email, password) {
        // const response recebe a funcao LoginReq com o login e password
        const response = await LoginRequest(email, password)

        // const para armazenar dados recebidos da const response
        const payload = {
            id: response.id,
            name: response.name,
            email: response.email,
            token: response.token,
            isPeriodoTesteAtivo: response.isPeriodoTesteAtivo,
            isPlanoAtivo: response.isPlanoAtivo,
            dataFimPeriodoTeste: response.dataFimPeriodoTeste
        }

        console.log(payload)
        // Por fim setUsuario recebe os dados armazenados no payload
        setUsuario(payload)
        // E a funcao setUsuarioLocalStorage armazena as informacoes no localStorage
        setUsuarioLocalStorage(payload)
    }

    // Funcao de logout
    function logout() {

        // Para o logout, simplesmente deixar o setUsuario como null
        setUsuario(null)
        setUsuarioLocalStorage(null)
        localStorage.removeItem("jwtToken")
    }

    // Funcao para criar usuarios
    async function signUp(name, email, cpf_cnpj, password) {

        try {
            const usuario = await SignUpRequest(name, email, cpf_cnpj, password);
            if (usuario) {

                await autenticacao(email, password)
                return true;

            } else {
                return false;
            }
        } catch (error) {
            return false;
        }

    }

    // Retornando Provider que ficará em volta da aplicacao
    return (
        // Value passa todos os dados do usuario, e as funcoes para serem utilizadas na pagina de login
        <AuthContext.Provider value={{ ...usuario, autenticacao, logout, signUp }}>
            {children}
        </AuthContext.Provider>
    )

}