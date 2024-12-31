import { useContext } from "react"
import { AuthContext } from "./AuthProvider"

// Criando e exportando useAuth // useAuth podera ser chamado em qualquer componente para utilizar as funcoes que estao no AuthContext
export const useAuth = () => {

    // const context recebe o arquivo AuthContext
    const context = useContext(AuthContext)

    // retornando context para ser usado em qualquer componente
    return context;

}