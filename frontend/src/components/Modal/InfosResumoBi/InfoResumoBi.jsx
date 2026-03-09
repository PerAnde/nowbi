import React from 'react'

import * as PiIcons from 'react-icons/pi';

import styles from '../Modal.module.scss'

export const InfoResumoBi = ({ trigger, setTrigger }) => {
    return trigger ? (
        <div className={styles.popup}>
            <div className={`${styles.box_popup} ${styles.box_popup_dashboard_bi}`}>
                <div className={styles.box_header}>
                    <h3>{trigger.titulo}</h3>
                    <span onClick={() => { setTrigger(null) }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <div className={styles.box_frase_popup}>
                    <p>{trigger.descricaoDetalhada}</p>
                    <div className={styles.box_calculo}>
                        <p>{trigger.calculo}</p>
                    </div>
                    <p>{trigger.resumo}</p>
                </div>
            </div>
        </div>
    ) : "";
}