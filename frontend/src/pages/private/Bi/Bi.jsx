import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { buscarBi, atualizarStatus, excluirBi } from '../../../services/bis';
import { buscarEmpresa } from '../../../services/empresas';

import { Layout } from '../../../layout/Layout'

import { CriarLancamento } from '../../../components/Modal/LancamentoBi/CriarLancamento/CriarLancamento';

import { EditarBi } from '../../../components/Modal/BI/EditarBi/EditarBi';
import { ExcluirBi } from '../../../components/Modal/BI/ExcluirBi/ExcluirBi';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import * as PiIcons from 'react-icons/pi';

import styles from './Bi.module.scss'

export const Bi = () => {

    // Estados BI e Empresa
    const { id } = useParams();
    const [bi, setBi] = useState({});
    const [empresa, setEmpresa] = useState();
    const [loading, setLoading] = useState(true);

    const [popUpNovoLancamento, setPopUpNovoLancamento] = useState(false);
    const [popUpEditarBi, setPopUpEditarBi] = useState(false);
    const [popUpExcluirBi, setPopUpExcluirBi] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (popUpEditarBi) {
            document.body.style.overflow = 'hidden'; // Desativa o scroll
        } else {
            document.body.style.overflow = 'auto'; // Restaura o scroll
        }
    }, [popUpEditarBi]);

    useEffect(() => {
        buscarBi(id, setBi, setLoading, navigate)
    }, [id])

    useEffect(() => {
        if (bi?.empresa_id) {
            buscarEmpresa(bi?.empresa_id, setEmpresa, setLoading, navigate)
        }
    }, [bi])

    // Pegando id da empresa
    const idEmpresa = bi?.empresa_id;

    // Atualizar BI
    const atualizarBi = () => {
        buscarBi(id, setBi, setLoading);
    }

    // Atualziar status bi
    const atualizarStatusBi = async () => {
        try {
            await atualizarStatus(id, !bi.status);
            console.log(bi.status)
            atualizarBi();
        } catch (error) {
            console.error("Erro ao atualizar status do BI", error);
        }
    };

    // Excluir BI
    const confirmarExclusao = async () => {
        excluirBi(id, idEmpresa, navigate);
    }

    // Formata escrita Mes
    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <Layout>
            <div className="box_conteudo_paginas">

                <div className="header-paginas">

                    <div className="box-header">
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

                    <div className="box-header">
                        <div className="box-header-btns">
                            <div className="box-btns-pagina-bi">
                                <Link className={`${styles.btn_link_principal} ${styles.btn_editar}`} onClick={() => setPopUpEditarBi(true)}><PiIcons.PiNotePencilBold /></Link>
                                <Link className={`${styles.btn_link_principal} ${styles.btn_excluir}`} onClick={() => setPopUpExcluirBi(true)}><PiIcons.PiTrashBold /></Link>
                                {bi.status ? (
                                    <Link
                                        className={`${styles.btn_link_principal} ${styles.btn_concluir}`}
                                        onClick={() => atualizarStatusBi()}
                                    >
                                        <PiIcons.PiChecksBold /> Reabrir BI
                                    </Link>
                                ) : (
                                    <Link
                                        className={`${styles.btn_link_principal} ${styles.btn_concluir}`}
                                        onClick={() => atualizarStatusBi()}
                                    >
                                        <PiIcons.PiChecksBold /> Finalizar BI
                                    </Link>
                                )}

                            </div>
                            <Link className={styles.btn_link_principal} onClick={(e) => setPopUpNovoLancamento(true)}><PiIcons.PiPlusBold /> Novo Lançamento</Link>
                        </div>
                    </div>

                </div>

                <form className={styles.box_incluir_lancamento}>



                </form>

                <div className={styles.box_menu_lancamentos}>
                    <div className={styles.filtro_pagina}>
                        <Link className={`${styles.filtro_receitas} ${styles.ativo}`}>
                            <PiIcons.PiArrowUpRightBold />
                            Receitas
                        </Link>
                        <Link className={styles.filtro_despesas}>
                            <PiIcons.PiArrowDownRightBold />
                            Despesas
                        </Link>
                    </div>
                </div>

            </div>

            <CriarLancamento trigger={popUpNovoLancamento} setTrigger={setPopUpNovoLancamento} />
            <EditarBi trigger={popUpEditarBi} setTrigger={setPopUpEditarBi} biEditado={atualizarBi} />
            <ExcluirBi
                trigger={popUpExcluirBi}
                setTrigger={setPopUpExcluirBi}
                mensagem={<>Todos os dados desse <strong>BI</strong> serão <strong>excluídos permanentemente!</strong></>}
                onConfirm={confirmarExclusao}
                biExcluido={idEmpresa}
            />

        </Layout>
    )
}
