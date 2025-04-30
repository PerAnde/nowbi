import React from 'react'
import { Link } from 'react-router-dom';

import { Layout } from '../../../layout/Layout'

import styles from './Planos.module.scss'

import * as PiIcons from 'react-icons/pi';

export const Planos = () => {
    return (
        <Layout>
            <div className="box_conteudo_paginas">
                <div className="header-paginas">
                    <div className="box-header esquerdo">
                        <h2>Planos</h2>

                        <div className={styles.box_menu_pagina}>
                            <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Planos</p>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    )
}
