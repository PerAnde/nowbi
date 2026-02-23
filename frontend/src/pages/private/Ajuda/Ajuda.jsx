import React from 'react'
import { Link } from 'react-router-dom';

import { Layout } from '../../../layout/Layout'

import styles from './Ajuda.module.scss'
import * as PiIcons from 'react-icons/pi';

export const Ajuda = () => {
    return (
        <Layout>
            <div className="box_conteudo_paginas">
                <div className="header-paginas">
                    <div className="box-header">
                        <h2>Ajuda</h2>
                        <div className={styles.box_menu_pagina}>
                            <Link to="/dashboard" className={styles.link_menu_pagina}>
                                Dashboard
                            </Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Ajuda</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className={styles.box_ajuda}>
                <div className={styles.box_ajuda_whats}>
                    <PiIcons.PiWhatsappLogoLight className={styles.icone_suporte} />

                    <div className={styles.box_texto_ajuda}>
                        <p>Suporte via WhatsApp</p>
                        <span>Atendimento humanizado</span>
                        <Link to='https://api.whatsapp.com/send?phone=5547984178977' target='_blank' className={styles.btn_link_secundario} >Contato</Link>
                    </div>
                </div>

                <div className={styles.box_redes_sociais}>
                    <div className={styles.rede_social}>
                        <PiIcons.PiInstagramLogoLight className={styles.icone_suporte} />

                        <div className={styles.box_texto_ajuda}>
                            <p>Instagram</p>
                            <span>@nowbi_oficial</span>
                        </div>
                    </div>
                    <div className={styles.rede_social}>
                        <PiIcons.PiLinkedinLogoLight className={styles.icone_suporte} />

                        <div className={styles.box_texto_ajuda}>
                            <p>LinkedIn</p>
                            <span>@nowbi_oficial</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
