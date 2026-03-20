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
    const [telefone, setTelefone] = useState('')
    const [password, setPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState('')

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleWhatsappChange = (e) => {
        let value = e.target.value;

        value = value.replace(/\D/g, "");

        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else if (value.length > 5) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
        } else if (value.length > 0) {
            value = value.replace(/^(\d{0,2})/, "($1");
        }

        setTelefone(value);
    };

    async function handleSubmit(e) {
        e.preventDefault()

        if (!name || !email || !cpf_cnpj || !password || !telefone) {
            toast.warning("Por favor, preencha todos os campos!")
            return;
        }

        if (password !== passwordMatch) {
            toast.warning("As senhas não conferem!")
            return
        }

        const telefoneLimpo = telefone.replace(/\D/g, "");

        setLoading(true)

        try {

            const success = await auth.signUp(name, email, cpf_cnpj, password, telefoneLimpo)

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

    const toggleVisualizarSenha = () => {
        setShowPassword(!showPassword);
    };

    return (

        <div className={styles.container_auth}>

            <div className={styles.box_form}>
                <div className={styles.form}>

                    <div className={styles.box_header_form}>
                        <h2>Bem vindo ao <br></br><span className={styles.logo_texto_animado}>NowBi</span></h2>
                        <p>Crie sua conta e teste gratuitamente</p>
                    </div>

                    <form onSubmit={handleSubmit} >
                        <label>
                            <Input type="text" placeholder="Nome ou Razão Social" value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <label>
                            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>
                            <Input type="text" placeholder="CPF ou CNPJ" value={cpf_cnpj} onChange={(e) => setCpf_cnpj(e.target.value)} />
                        </label>
                        <label>
                            <Input type="text" placeholder="WhatsApp" value={telefone} onChange={handleWhatsappChange} />
                        </label>
                        <label className={styles.input_container}>
                            <Input type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />

                            <button
                                type="button"
                                className={styles.icon_button}
                                onClick={toggleVisualizarSenha}
                            >
                                {showPassword ? <PiIcons.PiEyeLight /> : <PiIcons.PiEyeClosedLight />}
                            </button>
                        </label>

                        <label>
                            <Input type={showPassword ? "text" : "password"} placeholder="Confirmar Senha" value={passwordMatch} onChange={(e) => setPasswordMatch(e.target.value)} />
                        </label>

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
