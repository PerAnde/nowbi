import React from 'react'
import { Link } from 'react-router-dom';

import styles from './MenuBi.module.scss'

import * as PiIcons from 'react-icons/pi';

export const MenuBi = () => {
    return (
        <div className={styles.menu_bi}>
            <div className={styles.links_menu}>
                <Link to='/dashboardbi' className={`${styles.btn_menu} ${location.pathname === '/dashboardbi' ? styles.ativo : ''}`} >
                    <PiIcons.PiAlignLeft className={styles.icon} /> Resumo
                </Link>
                <Link to='/entradasbi' className={`${styles.btn_menu} ${location.pathname === '/entradasbi' ? styles.ativo : ''}`} >
                    <PiIcons.PiTrendUpBold className={styles.icon} /> Entradas
                </Link>
                <Link to='/saidasbi' className={`${styles.btn_menu} ${location.pathname === '/saidasbi' ? styles.ativo : ''}`} >
                    <PiIcons.PiTrendDownBold className={styles.icon} /> Saídas
                </Link>
                <Link to='/detalhesbi' className={`${styles.btn_menu} ${location.pathname === '/detalhesbi' ? styles.ativo : ''}`} >
                    <PiIcons.PiListDashesBold className={styles.icon} /> Detalhes
                </Link>
            </div>
        </div>
    )
}
