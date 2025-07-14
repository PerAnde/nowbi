import React from 'react'

import styles from './LayoutBi.module.scss'

import { HeaderBi } from '../../components/global/HeaderBi/HeaderBi'
import { MenuBi } from '../../components/global/MenuBi/MenuBi'

export const LayoutBi = ({ children, empresa, abaAtiva, setViewMode }) => {
    return (
        <main className={styles.layout_bi}>

            <HeaderBi empresa={empresa} />
            <MenuBi abaAtiva={abaAtiva} setViewMode={setViewMode} />

            <section className={styles.sectionBi}>
                {children}
            </section>

        </main>
    )
}
