import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ResetPasswordRequest } from '../../../contexts/util';

import { Input } from '../../../components/Input/Input';
import { ButtonAuth } from '../../../components/ButtonAuth/ButtonAuth';

import styles from '../Auth.module.scss'

import * as PiIcons from "react-icons/pi";

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    async function handleReset(e) {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("As senhas não coincidem!");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        if (!token || !email) {
            toast.error("Token ou e-mail inválidos. Tente solicitar um novo link.");
            return;
        }

        setLoading(true);

        try {
            const data = await ResetPasswordRequest(email, token, newPassword);

            if (data) {
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const toggleVisualizarSenha = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`${styles.container_auth} ${styles.reset_password}`}>
            <div className={styles.box_form}>
                <div className={styles.form}>

                    <div className={styles.box_header_form}>
                        <h3>Redefinir senha</h3>
                        <p>Digite sua nova senha de acesso</p>
                    </div>

                    <form onSubmit={handleReset}>
                        <label className={styles.input_container}>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className={styles.icon_button}
                                onClick={toggleVisualizarSenha}
                            >
                                {showPassword ? <PiIcons.PiEyeLight /> : <PiIcons.PiEyeClosedLight />}
                            </button>
                        </label>

                        <label>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirme a nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>

                        <ButtonAuth type="submit" loading={loading} disabled={loading}>
                            {loading ? "Alterando..." : "Redefinir Senha"}
                        </ButtonAuth>

                        <div className={styles.box_voltar_login}>
                            <PiIcons.PiArrowLeftLight />
                            <Link to="https://app.nowbi.com.br">Voltar para o login</Link>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}