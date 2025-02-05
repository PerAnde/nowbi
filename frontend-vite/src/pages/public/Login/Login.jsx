import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/useAuth'
import { Link } from 'react-router-dom'

// Importando componentes
import { Input } from '../../../components/Input/Input'
import { ButtonAuth } from '../../../components/ButtonAuth/ButtonAuth'

// Estilos
import styles from '../Auth.module.scss'

// Icones
import * as PiIcons from "react-icons/pi";

// Imagens
import iconeLogo from '../../../assets/images/icone-logo-black.png'
import { toast } from 'sonner'

export const Login = () => {

    // Chamando Auth
    const auth = useAuth()

    // Dados incorretos
    const [campoEmailObrigatorio, setCampoEmailObrigatorio] = useState(false)
    const [campoPasswordObrigatorio, setCampoPasswordObrigatorio] = useState(false)

    // // Chamando history para redirecionar para outra pagina
    const navigate = useNavigate()

    // // armazenando dados preenchidos nos inputs
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    // // Funcao para logar
    async function handleSubmit(e) {
        e.preventDefault()

        // Validação dos campos
        const isEmailValid = email !== "";
        const isPasswordValid = password !== "";

        setCampoEmailObrigatorio(!isEmailValid);
        setCampoPasswordObrigatorio(!isPasswordValid);

        // Impede a continuação se algum campo estiver inválido
        if (!isEmailValid || !isPasswordValid) {
            toast.warning("Preencha todos os campos para continuar!")
            return;
        }

        setLoading(true)

        try {

            await auth.autenticacao(email, password)
            navigate("/dashboard")
            setLoading(false)

        } catch (error) {
            toast.error("Usuário ou senha inválido!")
            setLoading(false)
            return null
        }

    }

    return (

        <div className={styles.container_auth}>

            <div className={styles.box_form}>

                <div className={styles.box_header_form}>
                    <div className={styles.box_logo_now_bi}>
                        <img src={iconeLogo} />
                        <p>now<span>BI</span></p>
                    </div>
                    <h2>Olá, bem vindo de volta!</h2>
                    <p>Insira suas credenciais para continuar</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>
                        <p>Login:</p>
                        <Input type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${campoEmailObrigatorio ? styles.input_erro : ''}`} />

                        {campoEmailObrigatorio ? (
                            <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                        ) : (
                            ''
                        )}
                    </label>
                    <label>
                        <p>Senha:</p>
                        <Input type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className={`${campoPasswordObrigatorio ? styles.input_erro : ''}`} />
                        {campoPasswordObrigatorio ? (
                            <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                        ) : (
                            ''
                        )}
                    </label>

                    <ButtonAuth type="submit" loading={loading}>Entrar</ButtonAuth>

                </form>

                <Link to="/cadastro" className={styles.box_link}>

                    <div className={styles.link}>
                        <PiIcons.PiStarDuotone className={styles.icon} />
                        <div>
                            <p>Não tem uma conta?</p>
                            <p><span>Teste grátis por 7 dias!</span></p>
                        </div>
                    </div>

                    <PiIcons.PiCaretRight className={styles.icon} />
                </Link>

            </div>

        </div>
    )
}
