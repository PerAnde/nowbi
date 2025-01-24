import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { Link } from 'react-router-dom'
import { api } from '../../../services/api'

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import { CriarEmpresa } from '../../../components/CriarEmpresa/CriarEmpresa'

import { Layout } from '../../../layout/Layout'

import * as PiIcons from 'react-icons/pi';

import logoEmpresa1 from '../../../assets/images/avatar-9.jpg'

import styles from './Empresas.module.scss'

export const Empresas = () => {

    const [empresas, setEmpresas] = useState([])
    const [loading, setLoading] = useState(true);

    const [popUpNovaEmpresa, setPopUpNovaEmpresa] = useState(false);

    useEffect(() => {
        if (popUpNovaEmpresa) {
            document.body.style.overflow = 'hidden'; // Desativa o scroll
        } else {
            document.body.style.overflow = 'auto'; // Restaura o scroll
        }
    }, [popUpNovaEmpresa]);

    const buscarEmpreas = async () => {

        try {

            // Time para testar Skeletons
            await new Promise(resolve => setTimeout(resolve, 2000))

            const response = await api.get("/empresas");

            const dataCriacaoEmpresas = response.data.map(empresa => ({
                ...empresa,
                created_at: format(new Date(empresa.created_at), "dd MMM yyyy")
            }))

            setEmpresas(dataCriacaoEmpresas)
            setLoading(false);

        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        buscarEmpreas()
    }, [])

    return (
        <Layout>
            <div className="box_conteudo_paginas">

                <div className="header-paginas">

                    <div className="box-header direito">
                        <h2>Empresas</h2>

                        <div className={styles.box_menu_pagina}>
                            <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Empresas</p>
                        </div>
                    </div>

                    {empresas.length > 0 ? (
                        <div className="box-header esquerdo">
                            <Link className={styles.btn_link_principal} onClick={() => setPopUpNovaEmpresa(true)}><PiIcons.PiPlusBold /> Nova empresa</Link>
                        </div>
                    ) : (
                        ''
                    )}

                </div>

                <div className={styles.box_empresas}>
                    {loading ? (
                        Array.from({ length: 12 }).map((_, id) => (
                            <div key={id} className={styles.box_componente}>
                                <div className={styles.box_img_logo_empresa}>
                                    <Skeleton height={70} width={70} borderRadius={10} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                </div>

                                <div className={styles.box_infos_empresa}>
                                    <div className={styles.infos_empresa}>
                                        <div>
                                            <h3><Skeleton width={150} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' /></h3>
                                        </div>
                                        <div>
                                            <p className={styles.info_empresa}><Skeleton width={100} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' /></p>
                                        </div>
                                        <div>
                                            <p className={styles.info_total_bi}><Skeleton width={100} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' /></p>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div className={styles.box_btns_empresa}>
                                    <Skeleton width={100} height={35} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                    <Skeleton width={60} height={35} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                </div>
                            </div>
                        ))
                    ) : empresas.length > 0 ? (
                        empresas.map((empresa, id) => (
                            <div key={id} className={styles.box_componente}>
                                <div className={styles.box_img_logo_empresa}>
                                    <img
                                        src={empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : logoEmpresa1}
                                        alt="Logo Empresa"
                                    />
                                </div>

                                <div className={styles.box_infos_empresa}>
                                    <div className={styles.infos_empresa}>
                                        <div>
                                            <h3>{empresa.name}</h3>
                                        </div>
                                        <div>
                                            <p className={styles.info_empresa}>CNPJ: {empresa.cnpj_empresa}</p>
                                            <p className={styles.info_empresa}>Criada: {empresa.created_at}</p>
                                        </div>
                                        <div>
                                            <p className={styles.info_total_bi}><PiIcons.PiChartBarDuotone />12 BI's</p>
                                        </div>
                                    </div>

                                </div>

                                <hr />

                                <div className={styles.box_btns_empresa}>
                                    <Link className={`${styles.btn_link} ${styles.btn_link_cor_primaria}`}>
                                        Gerenciar BI's
                                    </Link>
                                    <Link to={`/empresas/${empresa.id}`} className={`${styles.btn_link} ${styles.btn_link_editar}`}>
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.box_sem_empresas}>
                            <span>
                                <PiIcons.PiListMagnifyingGlassDuotone />
                            </span>
                            <p>Nenhuma empresa cadastrada!<br></br>Clique no botão abaixo para cadastrar uma nova.</p>
                            <Link to='/novaempresa' className={styles.btn_link_principal}><PiIcons.PiPlusBold /> Nova empresa</Link>
                        </div>
                    )}
                </div>
            </div>

            <CriarEmpresa trigger={popUpNovaEmpresa} setTrigger={setPopUpNovaEmpresa} />
        </Layout>
    )
}
