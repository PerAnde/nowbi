import React from 'react'
import { Link } from 'react-router-dom';

import { Layout } from '../../../layout/Layout'

import styles from './Planos.module.scss'
import imgFoguete from '../../../assets/images/foguete.webp'
import imgFoguinho from '../../../assets/images/foguinho.webp'

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

                <div className={styles.box_conteudo_planos}>
                    <div className={styles.box_cards_planos}>

                        <div className={`${styles.card_plano} ${styles.plano_essencial}`}>
                            <div className={styles.box_info_oferta}>
                                <img src={imgFoguinho} />
                                <p>Por tempo limitado</p>
                            </div>
                            <div className={styles.descricao_plano}>
                                <h3>Essencial</h3>
                                <p>Perfeito para quem está começando</p>
                                <h4>R$ 19,90<span>/mês</span></h4>
                            </div>
                            <Link to="https://api.whatsapp.com/send?phone=5547984178977" target='_blank' className={`${styles.btn} ${styles.btn_border_dark}`}>Começar agora</Link>
                            <div className={styles.detalhes_plano}>
                                <p><PiIcons.PiLightningFill className={styles.icon_detalhes_plano} /> Até <strong>1 empresa</strong></p>
                                <p><PiIcons.PiCheckBold className={styles.icon_detalhes_plano} /> BI's ilimitados</p>
                                <p><PiIcons.PiCheckBold className={styles.icon_detalhes_plano} /> Lançamentos ilimitados</p>
                                <p><PiIcons.PiCheckBold className={styles.icon_detalhes_plano} /> Suporte via WhatsApp</p>
                            </div>
                        </div>

                        <div className={`${styles.card_plano} ${styles.plano_premium}`}>
                            <div className={styles.box_info_oferta}>
                                <img src={imgFoguinho} />
                                <p>Por tempo limitado</p>
                            </div>
                            <div className={styles.descricao_plano}>
                                <h3>Premium</h3>
                                <p>Mais gestão e escalabilidade</p>
                                <h4>R$ 184,90<span>/mês</span></h4>
                            </div>
                            <Link to="https://api.whatsapp.com/send?phone=5547984178977" target='_blank' className={`${styles.btn} ${styles.btn_full}`}>Começar agora</Link>
                            <div className={styles.detalhes_plano}>
                                <p><PiIcons.PiLightningFill className={styles.icon_detalhes_plano} /> Até <strong>10 empresas</strong></p>
                                <p><PiIcons.PiCheckBold className={styles.icon_detalhes_plano} /> BI's ilimitados</p>
                                <p><PiIcons.PiCheckBold className={styles.icon_detalhes_plano} /> Lançamentos ilimitados</p>
                                <p><PiIcons.PiCheckBold className={styles.icon_detalhes_plano} /> Suporte via WhatsApp</p>
                            </div>
                        </div>

                        <div className={`${styles.card_plano} ${styles.plano_pro}`}>
                            <div className={styles.box_info_oferta}>
                                <img src={imgFoguinho} />
                                <p>Por tempo limitado</p>
                            </div>
                            <div className={styles.descricao_plano}>
                                <h3>Pro</h3>
                                <p>Mais espaço para organizar e crescer</p>
                                <h4>R$ 95,90<span>/mês</span></h4>
                            </div>
                            <Link to="https://api.whatsapp.com/send?phone=5547984178977" target='_blank' className={`${styles.btn} ${styles.btn_border_dark}`}>Começar agora</Link>
                            <div className={styles.detalhes_plano}>
                                <p><PiIcons.PiLightningFill className={styles.icon_detalhes_plano} /> Até <strong>5 empresas</strong></p>
                                <p><PiIcons.PiCheckBold className={styles.icon_detalhes_plano} /> BI's ilimitados</p>
                                <p><PiIcons.PiCheckBold className={styles.icon_detalhes_plano} /> Lançamentos ilimitados</p>
                                <p><PiIcons.PiCheckBold className={styles.icon_detalhes_plano} /> Suporte via WhatsApp</p>
                            </div>
                        </div>

                    </div>

                    <div className={styles.box_plano_personalizado}>
                        <div className={styles.detalhes_plano_personalizado}>
                            <h3>Seu negócio vai além dos nossos planos?</h3>
                            <p>Montamos um plano sob medida para atender às suas necessidades.</p>
                            <Link to="https://api.whatsapp.com/send?phone=5547984178977" target='_blank' className={`${styles.btn} ${styles.btn_border_light}`}>Fale conosco</Link>
                        </div>
                        <img src={imgFoguete} />
                    </div>
                </div>

            </div>
        </Layout>
    )
}
