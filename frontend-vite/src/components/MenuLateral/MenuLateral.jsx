import React from 'react'

// Imagens
import iconeLogo from '../../assets/images/icone-logo.svg'

import styles from './MenuLateral.module.scss'

export const MenuLateral = () => {
    return (
        <div className={styles.box_logo_now_bi}>
            <img src={iconeLogo} />
            <p>now<span>BI</span></p>
        </div>
    )
}
