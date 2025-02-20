import React from 'react'
import { Link } from 'react-router-dom'

import styles from './NotFound.module.scss'

export const NotFound = () => {
    return (
        <div className={`${styles.cont_principal} ${styles.cont_error_active}`}>

            <div className={styles.error_fundo}>
                <span>404</span>
            </div>
            <div></div>
            <div className={styles.cont_error}>
                <h1>Oops...</h1>
                <p>A página que você procura não existe!</p>
                <Link to='/dashboard'>Voltar para o início</Link>
            </div>
            <div className={styles.cont_aura_1}></div>
            <div className={styles.cont_aura_2}></div>

        </div>
    )
}
