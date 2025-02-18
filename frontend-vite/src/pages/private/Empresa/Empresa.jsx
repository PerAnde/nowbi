import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buscarEmpresa } from '../../../services/empresas';
import { useNavigate } from "react-router-dom";

import { Layout } from '../../../layout/Layout'

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import { CriarBi } from '../../../components/Modal/CriarBi/CriarBi';

import * as PiIcons from 'react-icons/pi';

import styles from './Empresa.module.scss'

export const Empresa = () => {

    const { id } = useParams();

    const [empresa, setEmpresa] = useState({})
    const [loading, setLoading] = useState(true)

    const [popUpNovBi, setPopUpNovBi] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        if (popUpNovBi) {
            document.body.style.overflow = 'hidden'; // Desativa o scroll
        } else {
            document.body.style.overflow = 'auto'; // Restaura o scroll
        }
    }, [popUpNovBi]);

    useEffect(() => {
        buscarEmpresa(id, setEmpresa, setLoading, navigate)
    }, [id])

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <Layout>
            <div className="box_conteudo_paginas">

                <div className="header-paginas">

                    <div className="box-header esquerdo">
                        {loading ? (
                            <Skeleton width={200} height={25} borderRadius={6} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                        ) : (
                            <h2>{empresa?.name}</h2>
                        )}

                        <div className={styles.box_menu_pagina}>
                            <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                            <PiIcons.PiDotOutlineFill />
                            <Link to='/empresas' className={styles.link_menu_pagina}>Empresas</Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>
                                {loading ? (
                                    <Skeleton width={120} height={15} borderRadius={6} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                ) : (
                                    <span>{empresa?.name}</span>
                                )}
                            </p>
                        </div>
                    </div>

                    {empresa?.bis?.length > 0 ? (
                        <div className="box-header direito">
                            <Link className={styles.btn_link_principal} onClick={() => setPopUpNovBi(true)}><PiIcons.PiPlusBold /> Novo Bi</Link>
                        </div>
                    ) : (
                        ''
                    )}

                </div>

                <div className={styles.box_bis}>
                    {loading ? (
                        Array.from({ length: 12 }).map((_, id) => (
                            <div key={id} className={styles.box_componente}>
                                <Skeleton width={50} height={20} borderRadius={6} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                            </div>
                        ))
                    ) : empresa?.bis?.length > 0 ? (
                        empresa.bis.map((bi) => (
                            <div key={bi.id} className={styles.box_componente}>
                                <div className={styles.box_header_componente}>
                                    <p><span><PiIcons.PiCalendarBlankBold /></span>{capitalizeFirstLetter(bi.mes)} / {bi.ano}</p>
                                    <div className={styles.box_status_bi}>
                                        <p>Em progresso</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.box_sem_empresas}>
                            <span>
                                <PiIcons.PiListMagnifyingGlassDuotone />
                            </span>
                            <p>Nenhum BI cadastrado!<br></br>Clique no botão abaixo para cadastrar um novo BI.</p>
                            <Link className={styles.btn_link_principal} onClick={() => setPopUpNovBi(true)}><PiIcons.PiPlusBold /> Novo Bi</Link>
                        </div>
                    )}

                </div>

            </div>

            <CriarBi trigger={popUpNovBi} setTrigger={setPopUpNovBi} empresaId={id} />

        </Layout>
    )
}
