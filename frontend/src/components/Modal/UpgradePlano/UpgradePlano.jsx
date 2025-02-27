import React from 'react'

import * as PiIcons from 'react-icons/pi';

import styles from '../Modal.module.scss'

export const UpgradePlano = ({ trigger, setTrigger }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Fazer Upgrade</h3>
                    <span onClick={() => { setTrigger(false) }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    Upgrade
                </form>

            </div>
        </div>

    ) : "";
}
