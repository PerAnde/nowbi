import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api/api';
import { buscarEmpresas, excluirEmpresa } from '../../../services/empresas';
import { Input } from '../../../components/Input/Input';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import { CriarEmpresa } from '../../../components/Modal/Empresa/CriarEmpresa/CriarEmpresa'
import { EditarEmpresa } from '../../../components/Modal/Empresa/EditarEmpresa/EditarEmpresa'
import { CodigoAcesso } from '../../../components/Modal/Empresa/CodigoAcesso/CodigoAcesso';
import { Integracao } from '../../../components/Modal/Empresa/Integracao/Integracao';
import { ExcluirEmpresa } from '../../../components/Modal/Empresa/ExcluirEmpresa/ExcluirEmpresa';

import { Layout } from '../../../layout/Layout'

import * as PiIcons from 'react-icons/pi';

import imgEmpresaSemLogo from '../../../assets/images/imgEmpresaSemLogo.jpg'
import imgBling from '../../../assets/images/logo-bling.png';

import styles from './Empresas.module.scss'
import { capitalizeFirstLetter } from '../../../utils/formatUtils'
import { toast } from 'sonner';
import { ConfigEmpresa } from '../../../components/Modal/Empresa/Configuracoes/ConfigEmpresa';

export const Empresas = () => {

    const [empresas, setEmpresas] = useState([])
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');

    const [menuAberto, setMenuAberto] = useState(null);
    const [popUpCriarEmpresa, setPopUpCriarEmpresa] = useState(false);
    const [popUpEditarEmpresa, setPopUpEditarEmpresa] = useState(false)
    const [popUpPin, setPopUpPin] = useState(false);
    const [popupIntegracao, setPopUpIntegracao] = useState(false);
    const [popUpConfigEmpresa, setPopUpConfigEmpresa] = useState(false);
    const [popUpExcluirEmpresa, setPopUpExcluirEmpresa] = useState(false);
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null)

    const [modoVisualizacao, setModoVisualizacao] = useState(() => {
        const salvo = localStorage.getItem('modoVisualizacao');
        return salvo ? salvo : 'grid';
    });

    const menuEmpresaRef = useRef([]);

    useEffect(() => {
        localStorage.setItem('modoVisualizacao', modoVisualizacao);
    }, [modoVisualizacao]);

    useEffect(() => {
        if (popUpCriarEmpresa || popUpEditarEmpresa || popUpExcluirEmpresa) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [popUpCriarEmpresa || popUpEditarEmpresa || popUpExcluirEmpresa]);

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

    const handleLinkCopiado = (empresa) => {
        const linkCompleto = `${window.location.origin}/dashboardbi/${empresa.link_bi}/login`;
        const mensagem = `*Acesse seu BI!*\n\n📊 Confira os dados aqui: ${linkCompleto}\n\n🔐 Código: *${empresa.pin_acesso}*`;

        navigator.clipboard.writeText(mensagem)
            .then(() => {
                toast.success("Link copiado para a área de transferência!");
            })
            .catch((err) => {
                toast.error("Erro ao copiar a mensagem.");
                console.error("Erro ao copiar a mensagem: ", err);
            });
    };

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

                </div>

                <div className={styles.box_buscas}>

                    <div className={styles.box_input_busca}>
                        <Input type="text" placeholder="Buscar empresa..." value={busca} onChange={(e) => setBusca(e.target.value)} className={styles.input_busca} />
                    </div>

                    <div className={styles.box_opces_nova_empresa}>
                        <div
                            className={`${styles.toggle_view} ${modoVisualizacao === 'lista' ? styles.lista : styles.grid
                                }`}
                        >
                            <button
                                className={styles.toggle_btn}
                                onClick={() => setModoVisualizacao('grid')}
                            >
                                <PiIcons.PiSquaresFourLight />
                            </button>

                            <button
                                className={styles.toggle_btn}
                                onClick={() => setModoVisualizacao('lista')}
                            >
                                <PiIcons.PiListLight />
                            </button>

                            <span className={styles.toggle_slider} />
                        </div>
                        <Link className={styles.btn_link_principal} onClick={() => setPopUpCriarEmpresa(true)}><PiIcons.PiPlusBold /> Nova empresa</Link>
                    </div>

                </div>

                <div className={`${styles.box_empresas} ${modoVisualizacao === 'lista' ? styles.lista : ''}`}>
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
                                    <Skeleton width={70} height={35} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                    <Skeleton width={50} height={35} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                </div>
                            </div>
                        ))
                    ) : buscaEmpresa.length > 0 ? (
                        buscaEmpresa.map((empresa, index) => {

                            const bis = empresa?.bis || [];

                            const total = bis.length;
                            const emProgresso = bis.filter(bi => bi.status === false).length;
                            const concluidos = bis.filter(bi => bi.status === true).length;

                            return (
                                <div key={empresa.id} className={styles.box_componente}>

                                    <div className={styles.box_header_empresa}>

                                        <div className={styles.box_img_logo_empresa}>
                                            <img
                                                src={empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : imgEmpresaSemLogo}
                                                alt="Logo Empresa"
                                            />
                                        </div>

                                        <div className={styles.infos_empresa}>
                                            <h3 className={
                                                modoVisualizacao === 'lista'
                                                    ? styles.nome_empresa_lista
                                                    : undefined
                                            }>{capitalizeFirstLetter(empresa.name)}</h3>
                                            <div>
                                                {empresa.cnpj_empresa ? <p className={styles.info_empresa}>CNPJ: {empresa.cnpj_empresa}</p> : ''}
                                                <p className={styles.info_empresa}>Criada: {empresa.created_at}</p>
                                                <div className={styles.box_integrado}>
                                                    {empresa?.blingIntegration?.isActive ? (
                                                        <div className={styles.box_integracoes}>
                                                            <img src={imgBling} alt="" />
                                                            <span>Bling</span>
                                                        </div>
                                                    ) :
                                                        null
                                                    }</div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className={styles.box_infos_bi}>
                                        <p><PiIcons.PiListChecksLight /> <span className={styles.info_total}>{total}</span></p>
                                        <p><PiIcons.PiSpinnerGapLight /> <span className={styles.info_em_progresso}>{emProgresso}</span></p>
                                        <p><PiIcons.PiChecksLight /> <span className={styles.info_concluidos}>{concluidos}</span></p>
                                    </div>

                                    <div className={styles.box_btns_empresa}>
                                        <Link to={`/empresas/${empresa.id}`} className={`${styles.btn_link} ${styles.btn_link_cor_primaria}`}>
                                            {modoVisualizacao === 'lista' ? <PiIcons.PiGear /> : 'Gerenciar'}
                                        </Link>
                                        <Link to={`/dashboardbi/${empresa.link_bi}`} target='_blank' className={`${styles.btn_link} ${styles.btn_link_cor_secundaria}`}>
                                            {modoVisualizacao === 'lista' ? <PiIcons.PiArrowSquareInLight /> : 'Visualizar'}
                                        </Link>
                                        <Link onClick={() => handleLinkCopiado(empresa)} className={`${styles.btn_link} ${styles.btn_link_cor_secundaria}`}>
                                            {modoVisualizacao === 'lista' ? (<PiIcons.PiLinkLight />) : (<><PiIcons.PiLinkBold /> Compartilhar</>)}
                                        </Link>
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
                                                <PiIcons.PiNotePencilLight />
                                                <p>Editar</p>
                                            </Link>
                                            <Link onClick={() => {
                                                setEmpresaSelecionada(empresa)
                                                setPopUpPin(true)
                                            }}>
                                                <PiIcons.PiPasswordLight />
                                                <p>Código de acesso</p>
                                            </Link>
                                            <Link onClick={() => {
                                                setEmpresaSelecionada(empresa)
                                                setPopUpConfigEmpresa(true)
                                            }}>
                                                <PiIcons.PiGearSixLight />
                                                <p>Configurações</p>
                                            </Link>
                                            {/* <Link onClick={() => {
                                                setEmpresaSelecionada(empresa)
                                                setPopUpIntegracao(true)
                                            }}>
                                                <PiIcons.PiPlugsConnected />
                                                <p>Integrar</p>
                                            </Link> */}
                                            <Link
                                                className={styles.btn_excluir}
                                                onClick={() => modalExcluirEmpresa({ id: empresa.id })}>
                                                <PiIcons.PiTrashLight />
                                                <p>Excluir</p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
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

            <CriarEmpresa
                trigger={popUpCriarEmpresa}
                setTrigger={setPopUpCriarEmpresa}
                empresaCriada={atualizarEmpresas} />
            <EditarEmpresa
                trigger={popUpEditarEmpresa}
                setTrigger={setPopUpEditarEmpresa}
                empresa={empresaSelecionada}
                empresaEditada={atualizarEmpresas} />
            <CodigoAcesso
                trigger={popUpPin}
                setTrigger={setPopUpPin}
                empresa={empresaSelecionada} />
            <Integracao
                trigger={popupIntegracao}
                setTrigger={setPopUpIntegracao}
                empresa={empresaSelecionada} />
            <ConfigEmpresa
                trigger={popUpConfigEmpresa}
                setTrigger={setPopUpConfigEmpresa}
                empresa={empresaSelecionada}
            />
            <ExcluirEmpresa
                trigger={popUpExcluirEmpresa}
                setTrigger={setPopUpExcluirEmpresa}
                mensagem={<>
                    Todos os dados e <strong>BIs</strong> dessa empresa serão <strong>excluídos permanentemente!</strong>
                </>}
                onConfirm={confirmarExclusao}
            />

        </Layout >
    )
}
