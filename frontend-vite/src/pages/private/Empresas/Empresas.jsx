import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../services/api'

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import { Layout } from '../../../layout/Layout'

import * as PiIcons from 'react-icons/pi';

import logoEmpresa1 from '../../../assets/images/avatar-9.jpg'

import styles from './Empresas.module.scss'

export const Empresas = () => {

    const [empresas, setEmpresas] = useState([])
    const [loading, setLoading] = useState(true);

    const buscarEmpreas = async () => {

        try {

            // Time para testar Skeletons
            await new Promise(resolve => setTimeout(resolve, 2000))

            const response = await api.get("/empresas");
            setEmpresas(response.data)
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
                <h2>Empresas</h2>

                <div className={styles.box_menu_pagina}>
                    <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                    <PiIcons.PiDotOutlineFill />
                    <p className={styles.link_menu_pagina_atual}>Empresas</p>
                </div>

                <div className={styles.box_empresas}>
                    {loading ? (
                        Array.from({ length: 12 }).map((_, id) => (
                            <div key={id} className={styles.box_componente}>
                                <Skeleton circle={true} height={120} width={120} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />

                                <div className={styles.box_infos_empresa}>
                                    <div className={styles.nome_empresa}>
                                        <h3><Skeleton width={150} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' /></h3>
                                        <p className={styles.info_cnpj}><Skeleton width={100} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' /></p>
                                    </div>

                                    <div className={styles.box_btns_empresa}>
                                        <Skeleton width={100} height={35} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                        <Skeleton width={60} height={35} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                    </div>
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
                                    <div className={styles.nome_empresa}>
                                        <h3>{empresa.name}</h3>
                                        <p className={styles.info_cnpj}>CNPJ: {empresa.cnpj_empresa}</p>
                                    </div>

                                    <div className={styles.box_btns_empresa}>
                                        <Link className={`${styles.btn_link} ${styles.btn_link_cor_primaria}`}>
                                            Gerenciar BI's
                                        </Link>
                                        <Link to={`/empresas/${empresa.id}`} className={`${styles.btn_link} ${styles.btn_link_editar}`}>
                                            Editar
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.box_sem_empresas}>
                            <span>
                                <PiIcons.PiListMagnifyingGlassDuotone />
                            </span>
                            <p>Nenhuma empresa cadastrada!<br></br>Clique no botão abaixo para cadastrar uma nova.</p>
                            <Link to='/novaempresa' className={styles.btn_link_principal}>Cadastrar empresa</Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}
