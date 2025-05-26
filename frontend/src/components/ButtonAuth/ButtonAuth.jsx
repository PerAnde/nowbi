import React from 'react'

import styles from './ButtonAuth.module.scss'

export const ButtonAuth = ({ loading, children, ...rest }) => {
    return (
        <button className={`${styles.button_principal} ${loading ? styles.btn_loading : ''}`} disabled={loading} {...rest}>

            {loading ? (
                <div className={styles.wrapper}>
                    <div className={styles.loading}>
                        <span className={styles.loader}></span>
                        <span className={styles.loader}></span>
                        <span className={styles.loader}></span>
                    </div>
                </div>
            ) : (
                <span>{children}</span>
            )}

        </button>
    )
}
