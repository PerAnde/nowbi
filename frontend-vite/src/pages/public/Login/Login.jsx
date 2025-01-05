import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/useAuth'
import { Link } from 'react-router-dom'

// Importando componentes
import { Input } from '../../../components/Input/Input'
import { Button } from '../../../components/Button/Button'

// Estilos
import styles from '../Auth.module.scss'

// Icones
import * as PiIcons from "react-icons/pi";

// Imagens
import iconeLogo from '../../../assets/images/icone-logo.svg'

export const Login = () => {

    // Chamando Auth
    const auth = useAuth()

    // // Chamando history para redirecionar para outra pagina
    const navigate = useNavigate()

    // // armazenando dados preenchidos nos inputs
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // // Funcao para logar
    async function handleSubmit(e) {
        e.preventDefault()

        if (email === "" || password === "") {
            alert("Preencha todos os dados!")
            return
        }

        try {

            await auth.autenticacao(email, password)
            navigate("/dashboard")

        } catch (error) {
            console.log(error)
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
                        <Input type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label>
                        <p>Senha:</p>
                        <Input type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>

                    <Button type="submit">Entrar</Button>
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
