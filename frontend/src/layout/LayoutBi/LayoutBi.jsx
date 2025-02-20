import React from 'react'

import styles from './LayoutBi.module.scss'

import { HeaderBi } from '../../components/global/HeaderBi/HeaderBi'
import { MenuBi } from '../../components/global/MenuBi/MenuBi'

export const LayoutBi = ({ children }) => {
    return (
        <main className={styles.layout_bi}>

            <HeaderBi />
            <MenuBi />

            <section className={styles.section}>
                {children}
            </section>

        </main>
    )
}
