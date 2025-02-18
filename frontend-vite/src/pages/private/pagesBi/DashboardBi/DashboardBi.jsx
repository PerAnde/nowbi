import React from 'react'

import styles from './DashboardBi.module.scss'

import { LayoutBi } from '../../../../layout/LayoutBi/LayoutBi'

import * as PiIcons from 'react-icons/pi';

export const DashboardBi = () => {
    return (
        <LayoutBi>

            <div className={styles.resumo_bi}>
                <div className={styles.header_resumo}>
                    <h3>Resumo</h3>
                    <span>R$ 49.520,12</span>
                </div>

                <div className={styles.box_infos_resumo}>

                    <div className={`${styles.box_dados} ${styles.box_receita} ${styles.ativo}`}>
                        <span className={`${styles.box_icone_dados} ${styles.icone_receita}`}>
                            <PiIcons.PiArrowUpRightBold />
                        </span>
                        <div className={styles.infos_dados}>
                            <p>Receitas</p>
                            <span>R$ 9.210,00</span>
                        </div>
                    </div>

                    <div className={`${styles.box_dados} ${styles.box_despesa}`}>
                        <span className={`${styles.box_icone_dados} ${styles.icone_despesa}`}>
                            <PiIcons.PiArrowDownRightBold  />
                        </span>
                        <div className={styles.infos_dados}>
                            <p>Despesas</p>
                            <span>R$ 2.782,23</span>
                        </div>
                    </div>

                </div>
            </div>

        </LayoutBi>
    )
}
