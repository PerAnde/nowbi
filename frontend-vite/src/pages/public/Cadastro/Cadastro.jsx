import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/useAuth'

// Importando componentes
import { Input } from '../../../components/Input/Input'
import { Button } from '../../../components/Button/Button'

// Estilos
import styles from '../Auth.module.scss'

// Icones
import * as PiIcons from "react-icons/pi";

// Imagens
import iconeLogo from '../../../assets/images/icone-logo.svg'

export const Cadastro = () => {

    // Chamando Auth
    const auth = useAuth()

    // Chamando history para redirecionar para outra pagina
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [cpf_cnpj, setCpf_cnpj] = useState('')
    const [password, setPassword] = useState('')

    const [passwordMatch, setPasswordMatch] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        if (name === "" || email === "" || password === "") {
            alert("Preencha todos os campos!")
            return;
        }

        if (password != passwordMatch) {
            alert("As senhas não coincidem!")
            return;
        }

        try {

            await auth.signUp(name, email, cpf_cnpj, password)
            navigate("/login")

        } catch (error) {
            console.log("erro ao cadastrar", error)
        }

    }

    return (

        <div className={styles.container_auth}>

            <div className={styles.box_form}>

                <div className={styles.box_header_form}>
                    <div className={styles.logo}>
                        <img src={iconeLogo} />
                        <p>now<span>BI</span></p>
                    </div>
                    <h2>Cadastre-se</h2>
                    <p>Teste gratuitamente por 7 dias!</p>
                </div>

                <form onSubmit={handleSubmit} >
                    <label>
                        <p>Nome ou Razão Social:</p>
                        <Input type="text" placeholder="Nome ou Razão Social" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label>
                        <p>Email:</p>
                        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label>
                        <p>CPF ou CNPJ:</p>
                        <Input type="text" placeholder="CPF ou CNPJ" value={cpf_cnpj} onChange={(e) => setCpf_cnpj(e.target.value)} />
                    </label>
                    <div className={styles.box_dados_cadastro}>
                        <label>
                            <p>Senha:</p>
                            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <label>
                            <p>Confirmar Senha:</p>
                            <Input type="password" placeholder="Senha" value={passwordMatch} onChange={(e) => setPasswordMatch(e.target.value)} />
                        </label>
                    </div>

                    <Button type="submit">Cadastrar</Button>
                </form>

                <Link to="/login" className={styles.box_link}>

                    <div className={styles.link}>
                        <PiIcons.PiSignInDuotone className={styles.icon} />
                        <div>
                            <p>Já possui uma conta?</p>
                            <p><span>Acesse sua conta!</span></p>
                        </div>
                    </div>

                    <PiIcons.PiCaretRight className={styles.icon} />
                </Link>

            </div>

        </div>

    )
}
