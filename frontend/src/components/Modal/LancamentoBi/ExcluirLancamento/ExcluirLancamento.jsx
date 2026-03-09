import React from 'react';
import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss';

import { Button } from '../../../Button/Button';

export const ExcluirLancamento = ({ trigger, setTrigger, mensagem, onConfirm }) => {
    return (trigger) ? (
        <div className={styles.popup}>
            <div className={styles.box_popup}>
                <div className={styles.box_header}>
                    <h3>Confirmar exclusão</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <p>{mensagem}</p>

                <div className={styles.box_btn_button}>
                    <Button onClick={onConfirm}>Confirmar</Button>
                    <Button onClick={() => setTrigger(false)} className={styles.btn_cancelar}>Cancelar</Button>
                </div>
            </div>
        </div>
    ) : null;
};
