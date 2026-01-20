import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../../Button/Button';
import * as PiIcons from 'react-icons/pi';
import { toast } from 'sonner';
import styles from './Integracao.module.scss';
import imgBling from '../../../../assets/images/logo-bling.png';

export const Integracao = ({ trigger, setTrigger, empresa }) => {
    const [pin, setPin] = useState(["", "", "", ""]);
    const inputsRef = useRef([]);
    const [loading, setLoading] = useState(false);

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
                    <img src={imgBling} alt="" />
                </div>

                {/* <div className={styles.box_btn_button}>
                    <Button type="submit" loading={loading}>Integrar</Button>
                </div> */}
            </div>
        </div>
    ) : null;
};
