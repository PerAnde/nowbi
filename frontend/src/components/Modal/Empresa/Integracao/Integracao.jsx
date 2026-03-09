import React, { useState, useEffect } from 'react';
import * as PiIcons from 'react-icons/pi';
import { excluirIntegracao } from '../../../../services/integracao';

import styles from '../../Modal.module.scss';
import stylesIntegracao from './Integracao.module.scss';

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
            <div className={styles.box_popup}>
                <div className={styles.box_header}>
                    <h3>Integrações</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                {jaIntegrado ? (
                    <div className={stylesIntegracao.box_status_ativo}>
                        <div className={stylesIntegracao.header_status}>
                            <PiIcons.PiSealCheckFill className={stylesIntegracao.icon_check} />
                            <h4>Integração Ativa</h4>
                            <p>Esta empresa já está integrada com sucesso ao <strong>Bling</strong>.</p>
                        </div>
                        <p>Deseja excluir essa integração?</p>
                        <span>Obs: Os meses que já foram importados serão preservados.</span>

                        <div className={stylesIntegracao.box_botoes_centro}>
                            <button onClick={() => handleExcluirIntegracao()} className={stylesIntegracao.btn_link_excluir}>
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

                                <div className={stylesIntegracao.box_integracoes}>
                                    <div
                                        className={`${stylesIntegracao.card_integracao} ${stylesIntegracao.box_bling}`}
                                        onClick={() => setEtapa('bling')}
                                    >
                                        <p>Bling</p>
                                    </div>
                                    <div
                                        className={`${stylesIntegracao.card_integracao} ${stylesIntegracao.box_conta_azul}`}
                                    >
                                        <p>Conta Azul <span>(Em breve)</span></p>
                                    </div>
                                </div>
                            </>
                        )}

                        {etapa === 'bling' && (
                            <div className={stylesIntegracao.container_etapa_bling}>
                                <div className={stylesIntegracao.box_observacoes_integracao}>
                                    <h4>Integrando com o Bling</h4>
                                    <p><strong>Atenção:</strong> antes de prosseguir, certifique-se de que você está desconectado de qualquer conta do Bling, para evitar a integração com a empresa errada.</p>
                                    <p>Em seguida, retorne a esta página e clique em <strong>“Integrar”</strong>.</p>
                                </div>

                                <div className={stylesIntegracao.box_botoes}>
                                    <button onClick={handleVoltar} className={stylesIntegracao.btn_link_cor_secundaria}>
                                        Voltar
                                    </button>

                                    {!podeIntegrar && (
                                        <button onClick={handleDesconectarBling} className={stylesIntegracao.btn_link_cor_primaria}>
                                            Desconectar do Bling
                                        </button>
                                    )}

                                    <button
                                        onClick={handleIntegrarBling}
                                        disabled={!podeIntegrar}
                                        className={`${podeIntegrar ? stylesIntegracao.btn_link_cor_primaria : ''}`}
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