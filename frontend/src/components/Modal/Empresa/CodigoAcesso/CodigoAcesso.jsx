import React, { useState, useRef, useEffect } from 'react';
import { buscarPin, atualizarPin } from '../../../../services/loginBi';
import { Button } from '../../../Button/Button';
import * as PiIcons from 'react-icons/pi';
import { toast } from 'sonner';
import styles from './CodigoAcesso.module.scss';

export const CodigoAcesso = ({ trigger, setTrigger, empresa }) => {
    const [pin, setPin] = useState(["", "", "", ""]);
    const inputsRef = useRef([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!trigger || !empresa?.id) return;

        const fetchPin = async () => {
            try {
                setLoading(true);
                const response = await buscarPin(empresa.id);
                if (response?.pin_acesso) {
                    const pinString = response.pin_acesso.toString().padStart(4, "0");
                    setPin(pinString.split(""));
                } else {
                    setPin(["", "", "", ""]);
                }
            } catch (error) {
                console.error("Erro ao buscar PIN:", error);
                toast.error("Erro ao buscar o PIN.");
            } finally {
                setLoading(false);
            }
        };

        fetchPin();
    }, [trigger, empresa]);

    const handleChange = (value, index) => {
        if (!/^[0-9]*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (pin.some((digit) => digit === "")) {
            toast.warning("Preencha todos os campos!");
            return;
        }

        if (!empresa?.id) {
            toast.error("ID da empresa não encontrado!");
            return;
        }

        const newPin = pin.join("");

        try {
            setLoading(true);
            await atualizarPin(empresa.id, newPin);
            toast.success("PIN atualizado com sucesso!");
            setTrigger(false);
        } catch (error) {
            console.error("Erro ao atualizar PIN:", error);
            toast.error("Erro ao atualizar o PIN.");
        } finally {
            setLoading(false);
        }
    };

    const handlePinCopiado = () => {
        if (!empresa) {
            toast.error("Empresa não disponível.");
            return;
        }

        const codigoPin = pin.join("");
        if (!codigoPin || codigoPin.length < 4) {
            toast.error("PIN incompleto.");
            return;
        }

        navigator.clipboard.writeText(codigoPin)
            .then(() => {
                toast.success("PIN copiado para a área de transferência!");
            })
            .catch((err) => {
                toast.error("Erro ao copiar o PIN.");
                console.error("Erro ao copiar o PIN:", err);
            });
    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Código de acesso</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <div className={styles.box_observacoes}>
                    <p>Configure um PIN para proteger o acesso ao BI.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={styles.box_input_pin}>
                        {pin.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                placeholder="•"
                                value={value}
                                ref={(el) => (inputsRef.current[index] = el)}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={styles.input_pin}
                                disabled={loading}
                            />
                        ))}
                        <div onClick={handlePinCopiado} className={styles.btn_copiar_pin}>
                            <PiIcons.PiCopyBold />
                        </div>
                    </div>

                    <div className={styles.box_btn_button}>
                        <Button type="submit" loading={loading}>Salvar PIN</Button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};
