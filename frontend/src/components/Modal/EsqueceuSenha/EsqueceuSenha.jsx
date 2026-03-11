import React, { useState } from 'react'

import { RequestPasswordRecovery } from '../../../contexts/util'

import { Input } from '../../Input/Input';
import { ButtonAuth } from '../../../components/ButtonAuth/ButtonAuth'

import styles from '../Modal.module.scss'

import * as PiIcons from 'react-icons/pi';
import { toast } from 'sonner';

export const EsqueceuSenha = ({ trigger, setTrigger }) => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false)

    async function handleSendResetLink(e) {
        e.preventDefault();

        if (email === '') {
            toast.warning("Digite seu email!")
            return;
        }

        setLoading(true);

        const data = await RequestPasswordRecovery(email);

        if (data) {
            setTrigger(false);
            setEmail('');
        }

        setLoading(false);
    }

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.box_popup}>
                <div className={styles.box_header}>
                    <h3>Esqueceu sua senha?</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <form className={styles.box_form} style={{ marginBottom: 0 }} onSubmit={handleSendResetLink}>
                    <div className={styles.box_observacoes}>
                        <p>Por favor, insira o endereço de e-mail associado à sua conta, vamos enviar um link para redefinir sua senha.</p>
                    </div>

                    <Input
                        placeholder="Digite seu e-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className={styles.box_btn_button}>
                        <ButtonAuth type="submit" loading={loading}>Enviar link</ButtonAuth>
                    </div>
                </form>

            </div>
        </div>

    ) : "";
}