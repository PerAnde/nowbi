import React from 'react'
import { Link } from 'react-router-dom';

import { Layout } from '../../../layout/Layout'

import styles from './Planos.module.scss'
import imgUpgrade from '../../../assets/images/upgrade.png'

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

                <div className={styles.box_conteudos_planos}>
                    <div className={styles.box_plano}>
                        <div className={styles.header_plano}>
                            <i><PiIcons.PiStarFour /></i>
                            <h4>Essencial</h4>
                            <p>R$ 19,90<span>/mês</span></p>
                            <Link to="https://api.whatsapp.com/send?phone=5547992220209&text=Ol%C3%A1,%20gostaria%20de%20ativar%20minha%20conta%20no%20plano%20essencial,%20pode%20me%20ajuda?" target='_blank' className={`${styles.btn_contratar} ${styles.btn_contratar_full}`}>Atualizar plano</Link>
                        </div>
                        <div className={styles.detalhes_plano}>
                            <h5>Plano Essencial inclui</h5>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Até <strong>1 Empresa</strong></p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />BI's ilimitados</p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Lançamentos ilimitados</p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Exportação DRE em PDF</p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Suporte via WhatsApp</p>
                        </div>
                    </div>

                    <div className={styles.box_plano}>
                        <div className={styles.header_plano}>
                            <i><PiIcons.PiStarFour /></i>
                            <h4>Premium</h4>
                            <p>R$ 89,90<span>/mês</span></p>
                            <Link to="https://api.whatsapp.com/send?phone=5547992220209&text=Ol%C3%A1,%20gostaria%20de%20ativar%20minha%20conta%20no%20plano%20premium,%20pode%20me%20ajuda?" target='_blank' className={`${styles.btn_contratar} ${styles.btn_contratar_full}`}>Atualizar plano</Link>
                        </div>
                        <div className={styles.detalhes_plano}>
                            <h5>Plano Premium inclui</h5>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Até <strong>5 Empresas</strong></p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />BI's ilimitados</p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Lançamentos ilimitados</p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Exportação DRE em PDF</p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Suporte via WhatsApp</p>
                        </div>
                    </div>

                    <div className={styles.box_plano}>
                        <div className={styles.header_plano}>
                            <i><PiIcons.PiStarFour /></i>
                            <h4>Enterprise</h4>
                            <p>R$ 184,90<span>/mês</span></p>
                            <Link to="https://api.whatsapp.com/send?phone=5547992220209&text=Ol%C3%A1,%20gostaria%20de%20ativar%20minha%20conta%20no%20plano%20enterprise,%20pode%20me%20ajuda?" target='_blank' className={`${styles.btn_contratar} ${styles.btn_contratar_full}`}>Atualizar plano</Link>
                        </div>
                        <div className={styles.detalhes_plano}>
                            <h5>Plano Enterprise inclui</h5>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Até <strong>10 Empresas</strong></p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />BI's ilimitados</p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Lançamentos ilimitados</p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Exportação DRE em PDF</p>
                            <p><PiIcons.PiCheckFatFill className={styles.icone_detalhes_plano} />Suporte via WhatsApp</p>
                        </div>
                    </div>

                    <div className={styles.box_plano_sob_medida}>
                        <div className={styles.detalhes_plano_sob_medida}>
                            <h4>Precisa de mais de 10 empresas?</h4>
                            <p>Fale com a gente e vamos montar uma solução sob medida.</p>
                            <Link to="https://api.whatsapp.com/send?phone=5547992220209&text=Ol%C3%A1,%20gostaria%20de%20um%20plano%20personalizado,%20pode%20me%20ajuda?" target='_blank' className={`${styles.btn_contratar} ${styles.btn_contratar_full}`}>Fale conosco</Link>
                        </div>
                        <img src={imgUpgrade} alt="" />
                    </div>
                </div>

            </div>
        </Layout>
    )
}
