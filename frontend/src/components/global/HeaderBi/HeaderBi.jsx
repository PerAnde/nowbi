import React from 'react'
import styles from './HeaderBi.module.scss'
import iconeLogo from '../../../assets/images/icone-logo.png';

export const HeaderBi = () => {
    return (
        <div className={styles.box_header_bi}>

            <div className={styles.box_1}>

                <div className={styles.box_logo_now_bi}>
                    <img src={iconeLogo} />
                    <p>now<span>BI</span></p>
                </div>

            </div>

        </div>
    )
}
