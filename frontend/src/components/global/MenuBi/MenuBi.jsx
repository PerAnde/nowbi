import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import styles from './MenuBi.module.scss'

export const MenuBi = () => {
    const { link_bi } = useParams()
    const location = useLocation()

    const isAtiva = (rota) => location.pathname.includes(`/dashboardbi/${link_bi}/${rota}`)

    return (
        <div className={styles.menu_bi}>
            <div className={styles.links_menu}>
                <Link
                    className={`${styles.btn_menu} ${isAtiva('resumo') ? styles.ativo : ''}`}
                    to={`/dashboardbi/${link_bi}/resumo`}
                >
                    Dashboard
                </Link>

                <Link
                    className={`${styles.btn_menu} ${isAtiva('detalhes') ? styles.ativo : ''}`}
                    to={`/dashboardbi/${link_bi}/detalhes`}
                >
                    Detalhes
                </Link>

                <Link
                    className={`${styles.btn_menu} ${isAtiva('dre') ? styles.ativo : ''}`}
                    to={`/dashboardbi/${link_bi}/dre`}
                >
                    DFC
                </Link>
            </div>
        </div>
    )
}
