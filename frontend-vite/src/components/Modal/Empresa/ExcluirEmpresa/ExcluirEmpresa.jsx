import React, { useState } from 'react';
import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss';

import { Button } from '../../../Button/Button';
import { Input } from '../../../Input/Input';

export const ExcluirEmpresa = ({ trigger, setTrigger, mensagem, onConfirm }) => {

    const [confirmarCheckbox, setConfirmarCheckbox] = useState(false)

    return (trigger) ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Confirmar exclusão</h3>
                    <span onClick={() => { setTrigger(false); setConfirmarCheckbox(false) }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <p className={styles.mensagem}>{mensagem}</p>

                <div className={styles.box_confirmacao}>
                    <label className={styles.checkbox_confirmar} htmlFor="confirmarExclusao">
                        <Input
                            type="checkbox"
                            id="confirmarExclusao"
                            checked={confirmarCheckbox}
                            onChange={(e) => setConfirmarCheckbox(e.target.checked)}
                            className={styles.input_checkbox}
                        />
                        <span className={styles.custom_checkbox}></span>
                        <p>Estou ciente</p>
                    </label>
                </div>

                <div className={styles.box_btn_button}>
                    {confirmarCheckbox ? (
                        <Button onClick={onConfirm}>Confirmar</Button>
                    ) : ('')}
                    <Button onClick={() => setTrigger(false)} className={styles.btn_cancelar}>Cancelar</Button>
                </div>
            </div>
        </div>
    ) : null;
};
