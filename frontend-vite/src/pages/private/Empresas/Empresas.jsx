import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../services/api'

import { Layout } from '../../../layout/Layout'

import logoEmpresa1 from '../../../assets/images/avatar-9.jpg'

import styles from './Empresas.module.scss'

export const Empresas = () => {

    const [empresas, setEmpresas] = useState([])

    const buscarEmpreas = async () => {

        try {
            const response = await api.get("/empresas");
            setEmpresas(response.data)
            console.log(response)
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

                <div className={styles.box_empresas}>

                    {empresas.length > 0 ? (
                        empresas.map((empresa, index) => {

                            return ( // Garantindo que o JSX seja retornado corretamente
                                <div key={index} className={styles.box_componente}>
                                    <div className={styles.box_img_logo_empresa}>
                                        <img
                                            // Concatenando baseURL com o caminho da imagem
                                            src={empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : logoEmpresa1}
                                            alt="Logo Empresa"
                                        />
                                    </div>


                                    <div className={styles.box_infos_empresa}>
                                        <div className={styles.nome_empresa}>
                                            <h3>{empresa.name}</h3> {/* Nome da empresa aqui */}
                                            <p className={styles.info_cnpj}>CNPJ: {empresa.cnpj_empresa}</p>
                                        </div>

                                        <div className={styles.box_btns_empresa}>
                                            <Link className={`${styles.btn_link} ${styles.btn_link_cor_primaria}`}>
                                                Gerenciar BI's
                                            </Link>
                                            <Link className={`${styles.btn_link} ${styles.btn_link_editar}`}>
                                                Editar
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Não há empresas cadastradas.</p>
                    )}


                </div>

            </div>
        </Layout>
    )
}
