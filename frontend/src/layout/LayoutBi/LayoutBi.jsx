import React from 'react'

import styles from './LayoutBi.module.scss'

import { HeaderBi } from '../../components/global/HeaderBi/HeaderBi'

export const LayoutBi = ({ children }) => {
    return (
        <main className={styles.layout_bi}>

            <HeaderBi />

            <section className={styles.section}>
                {children}
            </section>

        </main>
    )
}
