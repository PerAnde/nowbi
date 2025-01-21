import React from 'react'

import styles from './ButtonAuth.module.scss'

export const ButtonAuth = ({ loading, children, ...rest }) => {
    return (
        <button className={`${styles.button_principal} ${loading ? styles.btn_loading : ''}`} disabled={loading} {...rest}>

            {loading ? (
                <span>Aguarde...</span>
            ) : (
                <span>{children}</span>
            )}

        </button>
    )
}
