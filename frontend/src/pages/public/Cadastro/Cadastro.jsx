import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/useAuth'
import { toast } from 'sonner'

// Importando componentes
import { Input } from '../../../components/Input/Input'
import { ButtonAuth } from '../../../components/ButtonAuth/ButtonAuth'

// Estilos
import styles from '../Auth.module.scss'

// Icones
import * as PiIcons from "react-icons/pi";

// Imagens
import iconeLogo from '../../../assets/images/icone-logo.png'
import imgAuth from '../../../assets/images/background.jpg'

export const Cadastro = () => {

    const auth = useAuth()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [cpf_cnpj, setCpf_cnpj] = useState('')
    const [password, setPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState('')

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        if (!name || !email || !cpf_cnpj || !password) {
            toast.warning("Por favor, preencha todos os campos!")
            return;
        }

        if (password !== passwordMatch) {
            toast.warning("As senhas não conferem!")
            return
        }

        setLoading(true)

        try {

            const success = await auth.signUp(name, email, cpf_cnpj, password)

            if (success) {
                navigate("/dashboard");
            } else {
                setLoading(false)
            }

        } catch (error) {
            toast.error(error.message || "Erro ao criar conta!")
            setLoading(false)
        }

    }

    return (

        <div className={styles.container_auth}>

            <div className={styles.box_form}>
                <div className={styles.form}>

                    <div className={styles.box_header_form}>
                        <h2>Bem vindo ao <br></br><span className={styles.logo_text}>NowBi</span></h2>
                        <p>Crie sua conta e teste gratuitamente</p>
                    </div>

                    <form onSubmit={handleSubmit} >
                        <label>
                            <Input type="text" placeholder="Nome ou Razão Social" value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <div className={styles.box_dados_cadastro}>
                            <label>
                                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </label>
                            <label>
                                <Input type="text" placeholder="CPF ou CNPJ" value={cpf_cnpj} onChange={(e) => setCpf_cnpj(e.target.value)} />
                            </label>
                        </div>
                        <div className={styles.box_dados_cadastro}>
                            <label>
                                <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </label>

                            <label>
                                <Input type="password" placeholder="Senha" value={passwordMatch} onChange={(e) => setPasswordMatch(e.target.value)} />
                            </label>
                        </div>

                        <ButtonAuth type="submit" loading={loading}>Cadastrar</ButtonAuth>
                    </form>

                    <Link to="/" className={styles.box_link}>

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

            <div className={styles.box_img_auth}>

                <div className={styles.box_descricao}>
                    <div className={styles.box_logo}>
                        <img src={iconeLogo} />
                        <p>NowBi</p>
                    </div>
                    <p>Visualize os números da sua empresa de forma clara e objetiva e tome decisões mais assertivas, com base em dados reais.</p>
                </div>

                <img src={imgAuth} alt="" />
            </div>

        </div>

    )
}
