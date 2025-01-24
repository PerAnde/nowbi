import React from 'react'
import { Link } from 'react-router-dom'

import { Layout } from '../../../layout/Layout'

import * as PiIcons from 'react-icons/pi';

import styles from './Categorias.module.scss'

export const Categorias = () => {
    return (

        <Layout>
            <div className="box_conteudo_paginas">

                <div className="header-paginas">

                    <div className="box-header direito">
                        <h2>Categorias</h2>

                        <div className={styles.box_menu_pagina}>
                            <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Categorias</p>
                        </div>
                    </div>

                    <div className="box-header esquerdo">
                        <Link to='/novacategoria' className={styles.btn_link_principal}><PiIcons.PiPlusBold /> Nova categoria</Link>
                    </div>

                </div>

                <div className={styles.filtro_pagina}>
                    <Link className={`${styles.filtro_receitas} ${styles.ativo}`}>Receitas <span>1</span></Link>
                    <Link className={`${styles.filtro_despesas} `}>Despesas <span>2</span></Link>
                </div>

                <div className={styles.box_categorias}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Subcategorias</th>
                                <th>Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Venda de mercadoria</td>
                                <td className={styles.td_subcategorias}>3</td>
                                <td className={styles.btn_opcoes_categoria}><span><PiIcons.PiDotsThreeVerticalBold /></span></td>
                            </tr>
                            <tr>
                                <td>Venda de produto</td>
                                <td className={styles.td_subcategorias}>1</td>
                                <td className={styles.btn_opcoes_categoria}><span><PiIcons.PiDotsThreeVerticalBold /></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </Layout>

    )
}
