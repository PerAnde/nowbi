import React, { useState, useRef, useEffect } from 'react'

import styles from './HeaderBi.module.scss'

import iconeLogo from '../../../assets/images/icone-logo.png';

import * as PiIcons from 'react-icons/pi';

export const HeaderBi = () => {
    return (
        <div className={styles.box_header_bi}>

            <div className={styles.box_1}>

                <div className={styles.box_logo_now_bi}>
                    <img src={iconeLogo} />
                    <p>now<span>BI</span></p>
                </div>

                <hr />

                <div className={styles.menu_mes_bi}>

                    <div className={styles.btn_menu_ano}>

                        <p>2025</p>
                        <PiIcons.PiCaretUpDownBold className={styles.icone_menu_bi} />

                    </div>

                    <div className={styles.btn_menu_mes}>

                        <p>Janeiro</p>
                        <PiIcons.PiCaretUpDownBold className={styles.icone_menu_bi} />

                    </div>

                </div>

            </div>

            <div className={styles.box_2}>

                <PiIcons.PiSignIn />

            </div>

        </div>
    )
}
