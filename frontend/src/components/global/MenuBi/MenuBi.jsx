import React from 'react'
import { Link } from 'react-router-dom';

import styles from './MenuBi.module.scss'

import * as PiIcons from 'react-icons/pi';

export const MenuBi = ({ abaAtiva, setViewMode }) => {
    return (
        <div className={styles.menu_bi}>
            <div className={styles.links_menu}>
                <Link className={`${styles.btn_menu} ${abaAtiva === "resumo" ? styles.ativo : ""}`} onClick={() => setViewMode("resumo")} >
                    <PiIcons.PiChartPieSlice /> Resumo
                </Link>
                <Link className={`${styles.btn_menu} ${abaAtiva === "dre" ? styles.ativo : ""}`} onClick={() => setViewMode("dre")} >
                    <PiIcons.PiListDashesBold /> DRE
                </Link>
            </div>
        </div>
    )
}
