import React, { useState, useEffect } from 'react';
import * as PiIcons from 'react-icons/pi';
import styles from './Integracao.module.scss';
import imgBling from '../../../../assets/images/logo-bling.png';

export const Integracao = ({ trigger, setTrigger, empresa }) => {
    const [etapa, setEtapa] = useState('escolha'); // escolha | bling
    const [podeIntegrar, setPodeIntegrar] = useState(false);

    useEffect(() => {
        if (!trigger) {
            setEtapa('escolha');
            setPodeIntegrar(false);
        }
    }, [trigger]);

    const handleVoltar = () => {
        setEtapa('escolha');
        setPodeIntegrar(false);
    };

    const handleDesconectarBling = () => {
        window.open('https://www.bling.com.br/logout.php', '_blank');
        setPodeIntegrar(true);
    };

    const handleIntegrarBling = () => {
        window.location.href = `https://api.nowbi.com.br/integrations/bling/connect?empresaId=${empresa.id}`;
    };

    if (!trigger) return null;

    return (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Integrações</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                {etapa === 'escolha' && (
                    <>
                        <div className={styles.box_observacoes}>
                            <p>Escolha uma plataforma para integrar</p>
                        </div>

                        <div className={styles.box_integracoes}>
                            <img
                                src={imgBling}
                                alt="Bling"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setEtapa('bling')}
                            />
                        </div>
                    </>
                )}

                {etapa === 'bling' && (
                    <>
                        <div className={styles.box_observacoes_integracao}>
                            <h4>Integrando com o Bling</h4>
                            <p>
                                Atenção: antes de prosseguir, desconecte-se de qualquer conta do Bling para evitar a integração com a empresa errada.
                            </p>
                            <p>Em seguida, retorne a esta página e clique em “Integrar”.</p>
                        </div>

                        <div className={styles.box_botoes}>
                            <button onClick={handleVoltar} className={`${styles.btn_link} ${styles.btn_link_cor_secundaria}`}>Voltar</button>

                            {!podeIntegrar && (
                                <button
                                    onClick={handleDesconectarBling}
                                    className={styles.btn_link_principal}
                                >
                                    Desconectar do Bling
                                </button>
                            )}

                            <button
                                onClick={handleIntegrarBling}
                                disabled={!podeIntegrar}
                                className={`
        ${styles.btn_link}
        ${podeIntegrar ? styles.btn_link_cor_primaria : styles.btn_link_disabled}
    `}
                            >
                                Integrar
                            </button>
                        </div>

                    </>
                )}
            </div>
        </div>
    );
};
