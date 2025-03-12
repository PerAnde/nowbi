import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api/api';
import { buscarEmpresas, excluirEmpresa } from '../../../services/empresas';
import { Input } from '../../../components/Input/Input';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import { CriarEmpresa } from '../../../components/Modal/Empresa/CriarEmpresa/CriarEmpresa'
import { EditarEmpresa } from '../../../components/Modal/Empresa/EditarEmpresa/EditarEmpresa'
import { ExcluirEmpresa } from '../../../components/Modal/Empresa/ExcluirEmpresa/ExcluirEmpresa';

import { Layout } from '../../../layout/Layout'

import * as PiIcons from 'react-icons/pi';

import imgEmpresaSemLogo from '../../../assets/images/imgEmpresaSemLogo.jpg'

import styles from './Empresas.module.scss'

export const Empresas = () => {

    const [empresas, setEmpresas] = useState([])
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');

    const [menuAberto, setMenuAberto] = useState(null);
    const [popUpNovaEmpresa, setPopUpNovaEmpresa] = useState(false);

    const [empresaSelecionada, setEmpresaSelecionada] = useState(null)

    const [popUpEditarEmpresa, setPopUpEditarEmpresa] = useState(false)
    const [popUpExcluirEmpresa, setPopUpExcluirEmpresa] = useState(false)

    const menuEmpresaRef = useRef([]);

    useEffect(() => {
        if (popUpNovaEmpresa) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [popUpNovaEmpresa]);

    // Abrir menu empresa
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                menuEmpresaRef.current[menuAberto] &&
                !menuEmpresaRef.current[menuAberto].contains(event.target)
            ) {
                setMenuAberto(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [menuAberto]);

    const handleMenuClick = (index) => {
        setMenuAberto((prev) => (prev === index ? null : index));
    };

    // Campos de busca
    const buscaEmpresa = empresas.filter(empresa =>
        empresa.name.toLowerCase().includes(busca.toLowerCase())
    );

    const atualizarEmpresas = () => {
        buscarEmpresas(setEmpresas, setLoading);
    };

    // Abrir modal de confirmacao
    const modalExcluirEmpresa = (empresa) => {
        setEmpresaSelecionada(empresa);
        setPopUpExcluirEmpresa(true);
    };

    const confirmarExclusao = async () => {
        if (!empresaSelecionada) return;
        await excluirEmpresa(empresaSelecionada.id)
        buscarEmpresas(setEmpresas, setLoading);
    }

    // Buscar empresas
    useEffect(() => {
        buscarEmpresas(setEmpresas, setLoading)
    }, [])

    return (
        <Layout>
            <div className="box_conteudo_paginas">

                <div className="header-paginas">

                    <div className="box-header">
                        <h2>Empresas</h2>

                        <div className={styles.box_menu_pagina}>
                            <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Empresas</p>
                        </div>
                    </div>

                    <div className="box-header">
                        <Link className={styles.btn_link_principal} onClick={() => setPopUpNovaEmpresa(true)}><PiIcons.PiPlusBold /> Nova empresa</Link>
                    </div>

                </div>

                <div className={styles.box_busca_empresa}>
                    <Input type="text" placeholder="Buscar empresa..." value={busca} onChange={(e) => setBusca(e.target.value)} className={styles.input_busca} />
                </div>

                <div className={styles.box_empresas}>
                    {loading ? (
                        Array.from({ length: 12 }).map((_, id) => (
                            <div key={id} className={styles.box_componente}>

                                <div className={styles.box_header_empresa}>
                                    <div className={styles.box_img_logo_empresa}>
                                        <Skeleton height={70} width={70} borderRadius={10} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                    </div>
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
                                            <p className={styles.info_empresa}><Skeleton width={100} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' /></p>
                                        </div>
                                        <div>
                                            <p className={styles.info_total_bi}><Skeleton width={50} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' /></p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.box_btns_empresa}>
                                    <Skeleton width={100} height={35} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                </div>
                            </div>
                        ))
                    ) : buscaEmpresa.length > 0 ? (
                        buscaEmpresa.map((empresa, index) => (
                            <div key={empresa.id} className={styles.box_componente}>

                                <div>
                                    <div className={styles.box_header_empresa}>

                                        <div className={styles.box_img_logo_empresa}>
                                            <img
                                                src={empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : imgEmpresaSemLogo}
                                                alt="Logo Empresa"
                                            />
                                        </div>

                                        <div className={styles.btn_opcoes_empresa} ref={(el) => (menuEmpresaRef.current[index] = el)}>
                                            <span onClick={() => handleMenuClick(index)}>
                                                <PiIcons.PiDotsThreeVerticalBold />
                                            </span>
                                            <div className={`${styles.box_opcoes_empresas} ${menuAberto === index ? styles.ativo : styles.inativo}`}>
                                                <Link onClick={() => {
                                                    setEmpresaSelecionada(empresa)
                                                    setPopUpEditarEmpresa(true)
                                                }}>
                                                    <PiIcons.PiNotePencilBold />
                                                    <p>Editar</p>
                                                </Link>
                                                <Link className={styles.btn_excluir} onClick={() => modalExcluirEmpresa({ id: empresa.id })}>
                                                    <PiIcons.PiTrashBold />
                                                    <p>Excluir</p>
                                                </Link>
                                            </div>
                                        </div>

                                    </div>

                                    <div className={styles.box_infos_empresa}>

                                        <div className={styles.infos_empresa}>
                                            <div>
                                                <h3>{empresa.name}</h3>
                                            </div>
                                            <div>
                                                {empresa.cnpj_empresa <= 0 ? '' : <p className={styles.info_empresa}>CNPJ: {empresa.cnpj_empresa}</p>}
                                                <p className={styles.info_empresa}>Criada: {empresa.created_at}</p>
                                            </div>
                                            <div className={`${styles.info_total_bi} ${empresa.bis.length == 0 ? '' : styles.existe_bi}`}>
                                                <PiIcons.PiChartPieSliceDuotone />
                                                <p>{empresa.bis.length} BI's</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className={styles.box_btns_empresa}>
                                    <Link to={`/empresas/${empresa.id}`} className={`${styles.btn_link} ${styles.btn_link_cor_primaria}`}>
                                        Gerenciar BI's
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.box_sem_empresas}>
                            <span>
                                <PiIcons.PiListMagnifyingGlassDuotone />
                            </span>
                            <p>Nenhuma empresa!</p>
                        </div>
                    )}
                </div>
            </div>

            <CriarEmpresa trigger={popUpNovaEmpresa} setTrigger={setPopUpNovaEmpresa} empresaCriada={atualizarEmpresas} />
            <EditarEmpresa trigger={popUpEditarEmpresa} setTrigger={setPopUpEditarEmpresa} empresa={empresaSelecionada} empresaEditada={atualizarEmpresas} />

            <ExcluirEmpresa
                trigger={popUpExcluirEmpresa}
                setTrigger={setPopUpExcluirEmpresa}
                mensagem={<>
                    Todos os dados e <strong>BIs</strong> dessa empresa serão <strong>excluídos permanentemente!</strong>
                </>}
                onConfirm={confirmarExclusao}
            />

        </Layout>
    )
}
