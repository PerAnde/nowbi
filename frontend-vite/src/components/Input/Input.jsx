import React from 'react'

import styles from './Input.module.scss'

export const Input = ({ ...rest }) => {
    return (
        <input className={styles.input} {...rest} />
    )
}
