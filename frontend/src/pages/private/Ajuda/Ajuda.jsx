import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { buscarUsuarioStatus } from '../../../services/usuario';
import { calcularDiasRestantes } from '../../../utils/diasTeste'

import { Layout } from '../../../layout/Layout'

import styles from './Ajuda.module.scss'
import * as PiIcons from 'react-icons/pi';

export const Ajuda = () => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        buscarUsuarioStatus(setUsuario, setLoading);
    }, []);

    if (loading) return <p>Carregando status...</p>;

    const emTeste = !usuario?.isPlanoAtivo && usuario?.isPeriodoTesteAtivo;
    const contaSuspensa = !usuario?.isPlanoAtivo && !usuario?.isPeriodoTesteAtivo;
    const diasRestantes = usuario?.dataFimPeriodoTeste ? calcularDiasRestantes(usuario.dataFimPeriodoTeste) : 0;

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

            <div className={styles.box_info_conta}>
                {emTeste && (
                    <div className={`${styles.card_status} ${styles.status_teste}`}>
                        <p>Sua conta está em modo de experimental.</p>
                        <p><strong>
                            {(() => {
                                const agora = new Date();
                                const dataVencimento = new Date(usuario?.dataFimPeriodoTeste);

                                // Se ainda faltam 1 ou mais dias inteiros
                                if (diasRestantes > 0) {
                                    return `${diasRestantes} ${diasRestantes === 1 ? 'dia' : 'dias'}`;
                                }

                                // Se estamos no dia do vencimento (diasRestantes === 0)
                                if (diasRestantes === 0) {
                                    // Se o horário de agora ainda não passou do horário de vencimento
                                    if (agora < dataVencimento) {
                                        return 'Expira hoje';
                                    } else {
                                        return 'Expirado';
                                    }
                                }

                                // Se diasRestantes for menor que 0
                                return 'Expirado';
                            })()}
                        </strong></p>
                    </div>
                )}
                {contaSuspensa && (
                    <div className={`${styles.card_status} ${styles.status_suspenso}`}>
                        <p className={styles.destaque_suspensao}>Sua conta está <strong>temporariamente suspensa</strong>.</p>
                        <p>O período de teste ou seu plano expirou. Para reativar entre em contato com nosso suporte.</p>
                    </div>
                )}
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
                    <div className={styles.rede_social}>
                        <PiIcons.PiYoutubeLogoLight className={styles.icone_suporte} />

                        <div className={styles.box_texto_ajuda}>
                            <p>Youtube</p>
                            <span>@nowbi_oficial</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
