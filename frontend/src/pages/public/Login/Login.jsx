import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/useAuth'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { EsqueceuSenha } from '../../../components/Modal/EsqueceuSenha/EsqueceuSenha'

import { Input } from '../../../components/Input/Input'
import { ButtonAuth } from '../../../components/ButtonAuth/ButtonAuth'

import styles from '../Auth.module.scss'

import * as PiIcons from "react-icons/pi";

import iconeLogo from '../../../assets/images/icone-logo.png'
import imgAuth from '../../../assets/images/background.jpg'

export const Login = () => {

    const auth = useAuth()

    const [campoEmailObrigatorio, setCampoEmailObrigatorio] = useState(false)
    const [campoPasswordObrigatorio, setCampoPasswordObrigatorio] = useState(false)

    const [showPassword, setShowPassword] = useState(false);

    const [popUpEsqueceuSenha, setPopUpEsqueceuSenha] = useState(false);

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (popUpEsqueceuSenha) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [popUpEsqueceuSenha]);

    async function handleSubmit(e) {
        e.preventDefault()

        const isEmailValid = email !== "";
        const isPasswordValid = password !== "";

        setCampoEmailObrigatorio(!isEmailValid);
        setCampoPasswordObrigatorio(!isPasswordValid);

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
            setLoading(false)
            return null
        }

    }

    const toggleVisualizarSenha = () => {
        setShowPassword(!showPassword);
    };

    return (

        <div className={styles.container_auth}>

            <div className={styles.box_form}>
                <div className={styles.form}>

                    <div className={styles.box_header_form}>
                        <h2>Bem vindo ao <br></br><span className={styles.logo_texto_animado}>NowBi</span></h2>
                        <p>Insira suas credenciais para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label>
                            <Input type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${campoEmailObrigatorio ? styles.input_erro : ''}`} />

                            {campoEmailObrigatorio ? (
                                <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                            ) : (
                                ''
                            )}
                        </label>
                        <label className={styles.input_container}>
                            <Input type={showPassword ? "text" : "password"} placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className={`${campoPasswordObrigatorio ? styles.input_erro : ''}`} />
                            {campoPasswordObrigatorio ? (
                                <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                            ) : (
                                ''
                            )}

                            <button
                                type="button"
                                className={styles.icon_button}
                                onClick={toggleVisualizarSenha}
                            >
                                {showPassword ? <PiIcons.PiEyeLight /> : <PiIcons.PiEyeClosedLight />}
                            </button>
                        </label>


                        <div className={styles.box_btn_reset_password}>
                            <Link className={styles.btn_reset_password} onClick={() => setPopUpEsqueceuSenha(true)}>Esqueceu sua senha?</Link>
                        </div>

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

            <EsqueceuSenha trigger={popUpEsqueceuSenha} setTrigger={setPopUpEsqueceuSenha} />

        </div>
    )
}
