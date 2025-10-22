// LoginBi.jsx

// --- Importe useLocation ---
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { api } from '../../../../api/api'
import styles from './LoginBi.module.scss'
import { Button } from '../../../../components/Button/Button'
import { validarPinBi } from '../../../../services/loginBi';
import { toast } from 'sonner'

export const LoginBi = () => {
    const { link_bi } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

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
        // ... (sem alterações aqui)
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
                {/* <div className={styles.img_login_bi}>Conta8 Soluções</div> */}

                <div className={styles.box_titulo_login_bi}>
                    <h2>Seja bem-vindo</h2>
                    <p>Digite o PIN para acessar seu BI.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={styles.box_input_pin}>
                        {pin.map((value, index) => (
                            <input
                                key={index}
                                type="password"
                                maxLength={1}
                                placeholder="•"
                                value={value}
                                ref={(el) => (inputsRef.current[index] = el)}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={styles.input_pin}
                            />
                        ))}
                    </div>

                    <div className={styles.box_btn_button}>
                        <Button type="submit" loading={loading}>
                            {loading ? 'Validando...' : 'Acessar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}