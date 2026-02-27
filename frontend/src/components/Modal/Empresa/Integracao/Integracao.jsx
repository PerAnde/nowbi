import React, { useState, useEffect } from 'react';
import * as PiIcons from 'react-icons/pi';
import styles from './Integracao.module.scss';
import imgBling from '../../../../assets/images/logo-bling.png';
import { excluirIntegracao } from '../../../../services/integracao';

export const Integracao = ({ trigger, setTrigger, empresa }) => {
    const [etapa, setEtapa] = useState('escolha');
    const [podeIntegrar, setPodeIntegrar] = useState(false);

    const jaIntegrado = !!empresa?.blingIntegration;

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

    const handleExcluirIntegracao = async () => {
        const sucess = await excluirIntegracao(empresa.id);

        if (sucess) {
            setTrigger(false);
        }
    };

    return (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Integrações</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                {jaIntegrado ? (
                    <div className={styles.box_status_ativo}>
                        <div className={styles.header_status}>
                            <PiIcons.PiSealCheckFill className={styles.icon_check} />
                            <h4>Integração Ativa</h4>
                            <p>Esta empresa já está integrada com sucesso ao <strong>Bling</strong>.</p>
                        </div>
                        <p>Deseja excluir essa integração?</p>
                        <span>Obs: Os meses que já foram importados serão preservados.</span>

                        <div className={styles.box_botoes_centro}>
                            <button onClick={() => handleExcluirIntegracao()} className={styles.btn_link_excluir}>
                                Excluir integração
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {etapa === 'escolha' && (
                            <>
                                <div className={styles.box_observacoes}>
                                    <p>Escolha uma plataforma para integrar</p>
                                </div>

                                <div className={styles.box_integracoes}>
                                    <div
                                        className={styles.card_integracao}
                                        onClick={() => setEtapa('bling')}
                                    >
                                        <img src={imgBling} alt="Bling" />
                                    </div>
                                </div>
                            </>
                        )}

                        {etapa === 'bling' && (
                            <div className={styles.container_etapa_bling}>
                                <div className={styles.box_observacoes_integracao}>
                                    <h4>Integrando com o Bling</h4>
                                    <p><strong>Atenção:</strong> antes de prosseguir, certifique-se de que você está desconectado de qualquer conta do Bling, para evitar a integração com a empresa errada.</p>
                                    <p>Em seguida, retorne a esta página e clique em <strong>“Integrar”</strong>.</p>
                                </div>

                                <div className={styles.box_botoes}>
                                    <button onClick={handleVoltar} className={styles.btn_link_cor_secundaria}>
                                        Voltar
                                    </button>

                                    {!podeIntegrar && (
                                        <button onClick={handleDesconectarBling} className={styles.btn_link_principal}>
                                            Desconectar do Bling
                                        </button>
                                    )}

                                    <button
                                        onClick={handleIntegrarBling}
                                        disabled={!podeIntegrar}
                                        className={`${styles.btn_link} ${podeIntegrar ? styles.btn_link_cor_primaria : styles.btn_link_disabled}`}
                                    >
                                        Integrar
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};