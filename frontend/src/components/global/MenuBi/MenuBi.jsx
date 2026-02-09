import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import styles from './MenuBi.module.scss'
import { useBiPublic } from '../../../contexts/BiPublicContext'

export const MenuBi = () => {
    const { link_bi } = useParams()
    const location = useLocation()
    const { empresa } = useBiPublic()

    const isAtiva = (rota) => location.pathname.includes(`/dashboardbi/${link_bi}/${rota}`)

    return (
        <div className={styles.menu_bi}>
            <div className={styles.links_menu}>
                {empresa?.mostrar_resumo && (
                    <Link
                        className={`${styles.btn_menu} ${isAtiva('resumo') ? styles.ativo : ''}`}
                        to={`/dashboardbi/${link_bi}/resumo`}
                    >
                        Dashboard
                    </Link>
                )}
                {empresa?.mostrar_detalhes && (
                    <Link
                        className={`${styles.btn_menu} ${isAtiva('detalhes') ? styles.ativo : ''}`}
                        to={`/dashboardbi/${link_bi}/detalhes`}
                    >
                        Detalhes
                    </Link>
                )}
                {empresa?.mostrar_dfc && (
                    <Link
                        className={`${styles.btn_menu} ${isAtiva('dfc') ? styles.ativo : ''}`}
                        to={`/dashboardbi/${link_bi}/dfc`}
                    >
                        DFC
                    </Link>
                )}
                {empresa?.mostrar_dre && (
                    <Link
                        className={`${styles.btn_menu} ${isAtiva('dre') ? styles.ativo : ''}`}
                        to={`/dashboardbi/${link_bi}/dre`}
                    >
                        DRE
                    </Link>
                )}
                {empresa?.mostrar_relatorio && (
                    <Link
                        className={`${styles.btn_menu} ${isAtiva('relatorio') ? styles.ativo : ''}`}
                        to={`/dashboardbi/${link_bi}/relatorio`}
                    >
                        Relatório
                    </Link>
                )}
            </div>
        </div >
    )
}
