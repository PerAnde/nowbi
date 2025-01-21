import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/useAuth'

// Importando componentes
import { Input } from '../../../components/Input/Input'
import { ButtonAuth } from '../../../components/ButtonAuth/ButtonAuth'

// Estilos
import styles from '../Auth.module.scss'

// Icones
import * as PiIcons from "react-icons/pi";

// Imagens
import iconeLogo from '../../../assets/images/icone-logo-black.png'

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

    const [campoNameObrigatorio, setCampoNameObrigatorio] = useState(false)
    const [campoEmailObrigatorio, setCampoEmailObrigatorio] = useState(false)
    const [campoCpfCnpjObrigatorio, setCampoCpfCnpjObrigatorio] = useState(false)
    const [campoPasswordObrigatorio, setCampoPasswordObrigatorio] = useState(false)
    const [campoPasswordMatchObrigatorio, setCampoPasswordMatchObrigatorio] = useState(false)

    const [senhaNaoConfere, setSenhaNaoConfere] = useState(false)

    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        // Validação dos campos
        const isNameValid = name !== "";
        const isEmailValid = email !== "";
        const isCpfCnpjValid = cpf_cnpj !== "";
        const isPasswordValid = password !== "";
        const isPasswordMatchValid = passwordMatch !== "";

        setCampoNameObrigatorio(!isNameValid);
        setCampoEmailObrigatorio(!isEmailValid);
        setCampoCpfCnpjObrigatorio(!isCpfCnpjValid);
        setCampoPasswordObrigatorio(!isPasswordValid);
        setCampoPasswordMatchObrigatorio(!isPasswordMatchValid);

        // Impede a continuação se algum campo estiver inválido
        if (!isNameValid || !isEmailValid || !isCpfCnpjValid || !isPasswordValid || !isPasswordMatchValid) {
            return;
        }

        if (password !== passwordMatch) {
            setSenhaNaoConfere(true)
            return
        }

        setLoading(true)

        try {

            await auth.signUp(name, email, cpf_cnpj, password)
            // navigate("/")
            setLoading(false)

        } catch (error) {
            console.log(error.response.data.error)
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
                    <h2>Cadastre-se</h2>
                    <p>Teste gratuitamente por 7 dias!</p>
                </div>

                <form onSubmit={handleSubmit} >
                    <label>
                        <p>Nome ou Razão Social:</p>
                        <Input type="text" placeholder="Nome ou Razão Social" value={name} onChange={(e) => setName(e.target.value)} className={`${campoNameObrigatorio ? styles.input_erro : ''}`} />

                        {campoNameObrigatorio ? (
                            <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                        ) : (
                            ''
                        )}
                    </label>
                    <div className={styles.box_dados_cadastro}>
                        <label>
                            <p>Email:</p>
                            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${campoEmailObrigatorio ? styles.input_erro : ''}`} />

                            {campoEmailObrigatorio ? (
                                <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                            ) : (
                                ''
                            )}
                        </label>
                        <label>
                            <p>CPF ou CNPJ:</p>
                            <Input type="text" placeholder="CPF ou CNPJ" value={cpf_cnpj} onChange={(e) => setCpf_cnpj(e.target.value)} className={`${campoCpfCnpjObrigatorio ? styles.input_erro : ''}`} />

                            {campoCpfCnpjObrigatorio ? (
                                <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                            ) : (
                                ''
                            )}
                        </label>
                    </div>
                    <div className={styles.box_dados_cadastro}>
                        <label>
                            <p>Senha:</p>
                            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className={`${campoPasswordObrigatorio ? styles.input_erro : ''}`} />

                            {campoPasswordObrigatorio ? (
                                <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                            ) : (
                                ''
                            )}
                        </label>

                        <label>
                            <p>Confirmar senha:</p>
                            <Input type="password" placeholder="Senha" value={passwordMatch} onChange={(e) => setPasswordMatch(e.target.value)} className={`${campoPasswordMatchObrigatorio ? styles.input_erro : ''}`} />

                            {campoPasswordMatchObrigatorio ? (
                                <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                            ) : (
                                ''
                            )}
                        </label>
                    </div>

                    {senhaNaoConfere ? (
                        <span className={styles.usuario_senha_invalido}>As senhas não conferem!</span>
                    ) : (
                        ''
                    )}

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

    )
}
