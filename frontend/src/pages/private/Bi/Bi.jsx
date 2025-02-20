import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { buscarBi } from '../../../services/bis';
import { buscarEmpresa } from '../../../services/empresas';

import { Layout } from '../../../layout/Layout'

import { CriarLancamento } from '../../../components/Modal/LancamentoBi/CriarLancamento/CriarLancamento'

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import * as PiIcons from 'react-icons/pi';

import styles from './Bi.module.scss'

export const Bi = () => {

    const { id } = useParams();

    const [bi, setBi] = useState({});
    const [empresa, setEmpresa] = useState();
    const [loading, setLoading] = useState(true);

    const [popUpNovoLancamento, setPopUpNovoLancamento] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (popUpNovoLancamento) {
            document.body.style.overflow = 'hidden'; // Desativa o scroll
        } else {
            document.body.style.overflow = 'auto'; // Restaura o scroll
        }
    }, [popUpNovoLancamento]);

    useEffect(() => {
        buscarBi(id, setBi, setLoading, navigate)
    }, [id])

    useEffect(() => {
        if (bi?.empresa_id) {
            buscarEmpresa(bi?.empresa_id, setEmpresa, setLoading, navigate)
        }
    }, [bi])

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
                            <h2>
                                <span>{capitalizeFirstLetter(bi.mes)} / {bi.ano}</span>
                                <p className={`${styles.box_status_bi} ${bi.status ? styles.bi_concluido : styles.bi_em_progresso}`}>{bi.status ? "Concluído" : "Em progresso"}</p>
                            </h2>
                        )}

                        <div className={styles.box_menu_pagina}>
                            <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                            <PiIcons.PiDotOutlineFill />
                            <Link to='/empresas' className={styles.link_menu_pagina}>Empresas</Link>
                            <PiIcons.PiDotOutlineFill />
                            <Link to={`/empresas/${bi?.empresa_id}`} className={styles.link_menu_pagina}>{empresa?.name}</Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>
                                {loading ? (
                                    <Skeleton width={120} height={15} borderRadius={6} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                ) : (
                                    <span>{capitalizeFirstLetter(bi.mes)} / {bi.ano}</span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="box-header direito">
                        <Link className={styles.btn_link_principal} onClick={() => setPopUpNovoLancamento(true)}><PiIcons.PiPlusBold /> Novo Lançamento</Link>
                    </div>

                </div>

                <div className={styles.box_menu_categorias}>

                </div>

            </div>

            <CriarLancamento trigger={popUpNovoLancamento} setTrigger={setPopUpNovoLancamento} />

        </Layout>
    )
}
