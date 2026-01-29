import React, { useState, useRef, useEffect } from 'react';
import * as PiIcons from 'react-icons/pi';
import styles from './Integracao.module.scss';
import imgBling from '../../../../assets/images/logo-bling.png';

export const Integracao = ({ trigger, setTrigger, empresa }) => {
    useEffect(() => {
        if (!trigger || !empresa?.id) return;

    }, [trigger, empresa]);

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Integrações</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <div className={styles.box_observacoes}>
                    <p>Escolha uma plataforma para integrar</p>
                </div>

                <div className={styles.box_integracoes}>
                    <a href={`https://api.nowbi.com.br/integrations/bling/bling/test?empresaId=${empresa.id}`}>
                        <img src={imgBling} alt="" />
                    </a>
                </div>
            </div>
        </div>
    ) : null;
};
