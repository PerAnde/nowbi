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

                        <div class={`${styles.card_plano} ${styles.plano_essencial}`}>
                            <div class={styles.descricao_plano}>
                                <h3>Solo</h3>
                                <p>Ideal para o dono de empresa</p>
                                <h4>R$ 69,90<span>/mês</span></h4>
                                <p>.</p>
                            </div>
                            <a href="https://api.whatsapp.com/send?phone=5547984178977" target="_blank"
                                class={styles.btn_plano}>Assinar Solo</a>
                            <div class={styles.detalhes_plano}>
                                <p><i class="ph-light ph-building"></i> <strong>1 CNPJ</strong></p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Dashboard Interativo</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Lançamentos Ilimitados</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Importação via CSV / XLS</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Relatório com I.A</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Suporte via WhatsApp</p>
                                <p>R$ 50,00 CNPJ por adicional</p>
                            </div>
                        </div>

                        <div class={`${styles.card_plano} ${styles.plano_premium}`}>
                            <div class={styles.descricao_plano}>
                                <h3>Starter</h3>
                                <p>Para mais empresas</p>
                                <h4>R$ 244,90<span>/mês</span></h4>
                                <p>R$ 48,98 por CNPJ</p>
                            </div>
                            <a href="https://api.whatsapp.com/send?phone=5547984178977" target="_blank"
                                class={styles.btn_plano}>Assinar Starter</a>
                            <div class={styles.detalhes_plano}>
                                <p><i class="ph-light ph-building"></i><strong>5 CNPJs</strong></p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Dashboard Interativo</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Lançamentos Ilimitados</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Importação via CSV / XLS</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Relatório com I.A</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Suporte via WhatsApp</p>
                                <p>R$ 45,00 CNPJ por adicional</p>
                            </div>
                        </div>

                        <div class={`${styles.card_plano} ${styles.plano_pro}`}>
                            <div class={styles.descricao_plano}>
                                <h3>Pro</h3>
                                <p>Escalabilidade para grandes operações</p>
                                <h4>R$ 439,90<span>/mês</span></h4>
                                <p>R$ 43,99 por CNPJ</p>
                            </div>
                            <a href="https://api.whatsapp.com/send?phone=5547984178977" target="_blank"
                                class={styles.btn_plano}>Assinar Pro</a>
                            <div class={styles.detalhes_plano}>
                                <p><i class="ph-light ph-building"></i><strong>10 CNPJs</strong></p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Dashboard Interativo</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Lançamentos Ilimitados</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Importação via CSV / XLS</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Relatório com I.A</p>
                                <p><PiIcons.PiCheck className={styles.icone_plano} /> Suporte via WhatsApp</p>
                                <p>R$ 40,00 CNPJ por adicional</p>
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
