import React from 'react'
import { Link } from 'react-router-dom';

import { Layout } from '../../../layout/Layout'

import styles from './Tutoriais.module.scss'
import * as PiIcons from 'react-icons/pi';

export const Tutoriais = () => {
    return (
        <Layout>
            <div className="box_conteudo_paginas">
                <div className="header-paginas">
                    <div className="box-header">
                        <h2>Tutoriais</h2>
                        <div className={styles.box_menu_pagina}>
                            <Link to="/dashboard" className={styles.link_menu_pagina}>
                                Dashboard
                            </Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Tutoriais</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className={styles.box_tutoriais}>
                <div className={styles.header_box_tutoriais}>
                    <p>Tutoriais completos para ajudar você a utilizar o sistema.</p>
                </div>

                <div className={styles.filtro_pagina}>
                    <Link className={styles.filtro_todos}>
                        <PiIcons.PiListLight />
                        Todos
                    </Link>
                    <Link className={styles.filtro_em_progresso}>
                        <PiIcons.PiBuildingLight />
                        Empresas
                    </Link>
                    <Link className={styles.filtro_em_progresso}>
                        <PiIcons.PiListChecksLight />
                        Categorias
                    </Link>
                    <Link className={styles.filtro_em_progresso}>
                        <PiIcons.PiChartPieSliceLight  />
                        Bi
                    </Link>
                    <Link className={styles.filtro_concluido}>
                        <PiIcons.PiPlugsConnectedLight  />
                        Integrações
                    </Link>
                </div>

                <div className={styles.box_videos}>
                    <div className={styles.box_video}>
                        <div className={styles.capa_tutorial}>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsMk2aOzVP_WJCjUA8DvwKx9Orma9uGn2qWA&s" alt="" />
                        </div>
                        <div className={styles.titulo_video}>
                            <p>Como usar o sistema</p>
                            <span><PiIcons.PiListNumbersBold className={styles.icone_tutorial} /> Passo a passo</span>
                        </div>
                    </div>
                    <div className={styles.box_video}>
                        <div className={styles.capa_tutorial}>
                            <img src="https://s2.glbimg.com/14HekejauWTTQGBRfOkj4Dnhzqc=/e.glbimg.com/og/ed/f/original/2019/01/11/animal-mammal-mane-fauna-llama-alpaca-head-lama-vertebrate-camel-like-mammal-arabian-camel-902545.jpg" alt="" />
                        </div>
                        <div className={styles.titulo_video}>
                            <p>Como integrar com o Bling!</p>
                            <span><PiIcons.PiMonitorPlayBold className={styles.icone_tutorial} /> Vídeo</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
