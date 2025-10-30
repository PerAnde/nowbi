import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api/api';
import { buscarEmpresas, excluirEmpresa } from '../../../services/empresas';
import { buscarGrupo, buscarGrupos, excluirGrupo } from '../../../services/grupoEmpresas';
import { Input } from '../../../components/Input/Input';
// import { SelectGrupoEmpresa } from '../../../components/Selects/SelectGrupoEmpresa';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import { CriarEmpresa } from '../../../components/Modal/Empresa/CriarEmpresa/CriarEmpresa'
import { EditarEmpresa } from '../../../components/Modal/Empresa/EditarEmpresa/EditarEmpresa'
import { PinAcesso } from '../../../components/Modal/Empresa/PinAcesso/PinAcess';
import { ExcluirEmpresa } from '../../../components/Modal/Empresa/ExcluirEmpresa/ExcluirEmpresa';
import { CriarGrupo } from '../../../components/Modal/GrupoDeEmpresas/CriarGrupo'

import { Layout } from '../../../layout/Layout'

import * as PiIcons from 'react-icons/pi';

import imgEmpresaSemLogo from '../../../assets/images/imgEmpresaSemLogo.jpg'

import styles from './Empresas.module.scss'
import { EditarGrupo } from '../../../components/Modal/GrupoDeEmpresas/EditarGrupo';
import { ExcluirGrupo } from '../../../components/Modal/GrupoDeEmpresas/ExcluirGrupo';
import { AddEmpresaGrupo } from '../../../components/Modal/GrupoDeEmpresas/AddEmpresaGrupo';
import { capitalizeFirstLetter } from '../../../utils/formatUtils'
import { toast } from 'sonner';

export const Empresas = () => {

    const [empresas, setEmpresas] = useState([])
    const [grupo, setGrupo] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');

    const [menuAberto, setMenuAberto] = useState(null);
    const [popUpCriarEmpresa, setPopUpCriarEmpresa] = useState(false);
    const [popUpEditarEmpresa, setPopUpEditarEmpresa] = useState(false)
    const [popUpPin, setPopUpPin] = useState(false)
    const [popUpExcluirEmpresa, setPopUpExcluirEmpresa] = useState(false)
    const [popUpCriarGrupo, setPopUpCriarGrupo] = useState(false);
    const [popUpEditarGrupo, setPopUpEditarGrupo] = useState(false);
    const [popUpExcluirGrupo, setPopUpExcluirGrupo] = useState(false);
    const [popUpAddEmpresaGrupo, setPopUpAddEmpresaGrupo] = useState(false);

    const [empresaSelecionada, setEmpresaSelecionada] = useState(null)
    const [grupoSelecionado, setGrupoSelecionado] = useState('');

    const menuEmpresaRef = useRef([]);

    useEffect(() => {
        buscarGrupos(setGrupos)
    }, []);

    useEffect(() => {
        if (popUpCriarEmpresa || popUpEditarEmpresa || popUpExcluirEmpresa || popUpCriarGrupo || popUpEditarGrupo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [popUpCriarEmpresa || popUpEditarEmpresa || popUpExcluirEmpresa || popUpCriarGrupo || popUpEditarGrupo]);

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

    const confirmarExclusaoGrupo = async () => {
        if (!grupoSelecionado) return;
        await excluirGrupo(grupoSelecionado)
        buscarGrupos(setGrupos)
        setGrupoSelecionado(null)
    }

    // Buscar empresas
    useEffect(() => {
        buscarEmpresas(setEmpresas, setLoading)
    }, [])

    useEffect(() => {
        if (grupoSelecionado) {
            buscarGrupo(grupoSelecionado, setGrupo)
        } else {
            setGrupo({})
        }
    }, [grupoSelecionado])

    const atualizarGrupo = () => {
        if (grupoSelecionado) {
            buscarGrupo(grupoSelecionado, setGrupo);
            buscarGrupos(setGrupos)
        }
    };

    const handleLinkCopiado = (empresa) => {
        console.log(empresa)

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
                        <h2>{grupo.length > 0 && grupo[0]?.name ? `Empresas ${grupo[0].name}` : 'Empresas'}</h2>

                        <div className={styles.box_menu_pagina}>
                            <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Empresas</p>
                        </div>
                    </div>

                    <div className="box-header">
                        <div className="box-header-btns">
                            {grupo.length > 0 ? (
                                <div className={styles.box_btns_grupo}>
                                    <Link className={`${styles.btn_link_principal} ${styles.btn_editar}`} onClick={() => setPopUpEditarGrupo(true)}><PiIcons.PiNotePencilBold /> Editar grupo</Link>
                                    <Link className={`${styles.btn_link_principal} ${styles.btn_excluir}`} onClick={() => setPopUpExcluirGrupo(true)}><PiIcons.PiTrashBold />Excluir Grupo</Link>
                                </div>
                            ) : (
                                ''
                                // <Link className={`${styles.btn_link_principal} ${styles.btn_criar_grupo}`} onClick={() => setPopUpCriarGrupo(true)}><PiIcons.PiSquaresFourBold />Criar grupo</Link>
                            )}
                            <Link className={styles.btn_link_principal} onClick={() => setPopUpCriarEmpresa(true)}><PiIcons.PiPlusBold /> Nova empresa</Link>
                        </div>
                    </div>

                </div>

                <div className={styles.box_buscas}>
                    {/* <div className={styles.box_select_grupo}>
                        <SelectGrupoEmpresa
                            grupoSelecionado={grupoSelecionado}
                            setGrupoSelecionado={setGrupoSelecionado}
                            grupos={grupos}
                        />
                    </div> */}
                    {grupoSelecionado ? (
                        ''
                    ) : (
                        <div className={styles.box_input_busca}>
                            <Input type="text" placeholder="Buscar empresa..." value={busca} onChange={(e) => setBusca(e.target.value)} className={styles.input_busca} />
                        </div>
                    )}

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
                                    <Skeleton width={70} height={35} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                    <Skeleton width={50} height={35} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                </div>
                            </div>
                        ))
                    ) : grupo.length > 0 ? (
                        grupo[0]?.empresas.map((empresa, index) => (
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
                                                <Link onClick={() => handleLinkCopiado(empresa)} className={`${styles.btn_link} ${styles.btn_link_cor_secundaria}`}>
                                                    <PiIcons.PiLinkBold />
                                                    <p>Compartilhar</p>
                                                </Link>
                                                <Link
                                                    className={styles.btn_excluir}
                                                    onClick={() => modalExcluirEmpresa({ id: empresa.id })}>
                                                    <PiIcons.PiTrashBold />
                                                    <p>Excluir</p>
                                                </Link>
                                            </div>
                                        </div>

                                    </div>

                                    <div className={styles.box_infos_empresa}>

                                        <div className={styles.infos_empresa}>
                                            <div>
                                                <h3>{capitalizeFirstLetter(empresa.name)}</h3>
                                            </div>
                                            <div>
                                                {empresa.cnpj_empresa ? <p className={styles.info_empresa}>CNPJ: {empresa.cnpj_empresa}</p> : ''}
                                                <p className={styles.info_empresa}>Criada: {empresa.created_at}</p>
                                            </div>
                                            <div className={`${styles.info_total_bi} ${empresa.bis.length === 0 ? '' : styles.existe_bi}`}>
                                                <PiIcons.PiChartPieSliceDuotone />
                                                <p>{empresa.bis.length} BI's</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className={styles.box_btns_empresa}>
                                    <Link to={`/empresas/${empresa.id}`} className={`${styles.btn_link} ${styles.btn_link_cor_primaria}`}>
                                        Gerenciar
                                    </Link>
                                    <Link to={`/dashboardbi/${empresa.link_bi}`} target='_blank' className={`${styles.btn_link} ${styles.btn_link_cor_secundaria}`}>
                                        Visualizar
                                    </Link>
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
                                                <Link onClick={() => {
                                                    setEmpresaSelecionada(empresa)
                                                    setPopUpPin(true)
                                                }}>
                                                    <PiIcons.PiPasswordBold />
                                                    <p>PIN de acesso</p>
                                                </Link>
                                                {/* <Link
                                                    onClick={() => {
                                                        setEmpresaSelecionada(empresa.id)
                                                        setPopUpAddEmpresaGrupo(true)
                                                    }}>
                                                    <PiIcons.PiSquaresFourBold />
                                                    <p>Grupo</p>
                                                </Link> */}
                                                <Link
                                                    className={styles.btn_excluir}
                                                    onClick={() => modalExcluirEmpresa({ id: empresa.id })}>
                                                    <PiIcons.PiTrashBold />
                                                    <p>Excluir</p>
                                                </Link>
                                            </div>
                                        </div>

                                    </div>

                                    <div className={styles.box_infos_empresa}>

                                        <div className={styles.infos_empresa}>
                                            <div>
                                                <h3>{capitalizeFirstLetter(empresa.name)}</h3>
                                            </div>
                                            <div>
                                                {empresa.cnpj_empresa ? <p className={styles.info_empresa}>CNPJ: {empresa.cnpj_empresa}</p> : ''}
                                                <p className={styles.info_empresa}>Criada: {empresa.created_at}</p>
                                            </div>
                                            <div className={`${styles.info_total_bi} ${empresa.bis.length === 0 ? '' : styles.existe_bi}`}>
                                                <PiIcons.PiListBullets />
                                                <p>{empresa.bis.length} BI's</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className={styles.box_btns_empresa}>
                                    <Link to={`/empresas/${empresa.id}`} className={`${styles.btn_link} ${styles.btn_link_cor_primaria}`}>
                                        Gerenciar
                                    </Link>
                                    <Link to={`/dashboardbi/${empresa.link_bi}`} target='_blank' className={`${styles.btn_link} ${styles.btn_link_cor_secundaria}`}>
                                        Visualizar
                                    </Link>
                                    <Link onClick={() => handleLinkCopiado(empresa)} className={`${styles.btn_link} ${styles.btn_link_cor_secundaria}`}>
                                        <PiIcons.PiLinkBold />
                                        <p>Compartilhar</p>
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

            <CriarEmpresa
                trigger={popUpCriarEmpresa}
                setTrigger={setPopUpCriarEmpresa}
                empresaCriada={atualizarEmpresas} />
            <EditarEmpresa
                trigger={popUpEditarEmpresa}
                setTrigger={setPopUpEditarEmpresa}
                empresa={empresaSelecionada}
                empresaEditada={atualizarEmpresas} />
            <PinAcesso
                trigger={popUpPin}
                setTrigger={setPopUpPin}
                empresa={empresaSelecionada} />
            <ExcluirEmpresa
                trigger={popUpExcluirEmpresa}
                setTrigger={setPopUpExcluirEmpresa}
                mensagem={<>
                    Todos os dados e <strong>BIs</strong> dessa empresa serão <strong>excluídos permanentemente!</strong>
                </>}
                onConfirm={confirmarExclusao}
            />
            <CriarGrupo
                trigger={popUpCriarGrupo}
                setTrigger={setPopUpCriarGrupo}
                grupoCriado={() => buscarGrupos(setGrupos)}
            />
            <EditarGrupo
                trigger={popUpEditarGrupo}
                setTrigger={setPopUpEditarGrupo}
                grupo={grupo}
                grupoAtualizado={atualizarGrupo}
            />
            <ExcluirGrupo
                trigger={popUpExcluirGrupo}
                setTrigger={setPopUpExcluirGrupo}
                mensagem={<>
                    Excluir grupo?
                </>}
                onConfirm={confirmarExclusaoGrupo}
            />
            <AddEmpresaGrupo
                trigger={popUpAddEmpresaGrupo}
                setTrigger={setPopUpAddEmpresaGrupo}
                empresa={empresaSelecionada}
            />

        </Layout>
    )
}
