// LoginBi.jsx

// --- Importe useLocation ---
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import { api } from '../../../../api/api';
import { useBiPublic } from '../../../../contexts/BiPublicContext';

import { ButtonAuth } from '../../../../components/ButtonAuth/ButtonAuth'
import { validarPinBi } from '../../../../services/loginBi';

import styles from './LoginBi.module.scss'
import { toast } from 'sonner'

import imgEmpresaSemLogo from '../../../../assets/images/imgEmpresaSemLogo.jpg'

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const LoginBi = () => {
    const { link_bi } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const { empresa, loading: loadingEmpresa } = useBiPublic()

    const [pin, setPin] = useState(["", "", "", ""])
    const [loading, setLoading] = useState(false)
    const inputsRef = useRef([])

    useEffect(() => {
        inputsRef.current[0]?.focus()
    }, [])

    const handleChange = (value, index) => {
        if (!/^[0-9]*$/.test(value)) return

        const newPin = [...pin]
        newPin[index] = value
        setPin(newPin)

        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            inputsRef.current[index - 1].focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (pin.some((p) => p === "")) {
            toast.warning("Insira o PIN")
            return
        }

        setLoading(true)
        const pinValue = pin.join('')
        const from = location.state?.from?.pathname || `/dashboardbi/${link_bi}/resumo`

        try {
            const data = await validarPinBi(link_bi, pinValue);

            if (data.valido) {
                sessionStorage.setItem('authenticated_bi_link', link_bi);
                navigate(from, { replace: true });
            } else {
                toast.error('PIN incorreto, tente novamente.');
                setPin(["", "", "", ""]);
                inputsRef.current[0].focus();
            }
        } catch {
            toast.error('Erro ao validar o PIN. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container_login_bi}>
            <div className={styles.box_login_bi}>

                <div className={styles.header_branding}>
                    <div className={styles.client_info}>
                        {loadingEmpresa ? (
                            <Skeleton height={80} width={80} borderRadius={10} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                        ) : (
                            <img src={empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : imgEmpresaSemLogo} className={styles.logo_cliente} />
                        )}
                    </div>
                </div>

                <div className={styles.box_bem_vindo}>
                    <h3>Olá, <strong>{empresa?.name}</strong>!<br></br>Bem-vindo ao seu BI</h3>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_pin}>
                    <p className={styles.instrucao_pin}>Insira o seu código de acesso.</p>
                    <div className={styles.box_input_pin}>
                        {pin.map((value, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputsRef.current[index] = el)}
                                type="text"
                                maxLength={1}
                                placeholder="•"
                                value={value}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={styles.input_pin}
                                inputMode="numeric"
                            />
                        ))}
                    </div>

                    <div className={styles.box_btn_button}>
                        <ButtonAuth type="submit" loading={loading}>
                            {loading ? 'Autenticando...' : 'Acessar Dashboard'}
                        </ButtonAuth>
                    </div>
                </form>
            </div>
        </div>
    )
}