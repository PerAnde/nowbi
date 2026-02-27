import React from 'react'

import * as PiIcons from 'react-icons/pi';

import styles from './InfoResumoBi.module.scss'

export const InfoResumoBi = ({ trigger, setTrigger }) => {
    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>{trigger.titulo}</h3>
                    <span onClick={() => { setTrigger(null) }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <div className={styles.box_frase_popup}>
                    <p>{trigger.explicacao}</p>
                    <div className={styles.box_calculo}>
                        <p>{trigger.calculo}</p>
                    </div>
                </div>
            </div>
        </div>
    ) : "";
}