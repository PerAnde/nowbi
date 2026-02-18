import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../../../../layout/Layout';
import { Input } from '../../../../components/Input/Input';

import { buscarEmpresa } from '../../../../services/empresas';
import { buscarCategoriasPorEmpresa, excluirCategoria } from '../../../../services/categorias';
import { excluirSubcategoria } from '../../../../services/subcategorias';

import { capitalizeFirstLetter } from '../../../../utils/formatUtils'

import { CriarCategoria } from '../../../../components/Modal/Categorias/CriarCategoria/CriarCategoria';
import { EditarCategoria } from '../../../../components/Modal/Categorias/EditarCategoria/EditarCategoria';
import { ExcluirCategoria } from '../../../../components/Modal/Categorias/ExcluirCategoria/ExcluirCategoria';

import { CriarSubCategoria } from '../../../../components/Modal/Subcategorias/CriarSubCategoria/CriarSubCategoria';
import { EditarSubCategoria } from '../../../../components/Modal/Subcategorias/EditarSubCategoria/EditarSubCategoria';
import { ExcluirSubcategoria } from '../../../../components/Modal/Subcategorias/ExcluirSubcategoria/ExcluirSubcategoria';

import * as PiIcons from 'react-icons/pi';
import styles from '../PaginaCategoriasPorEmpresa.module.scss';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

export const CategoriasEmpresa = () => {

    const { id } = useParams();
    const [empresa, setEmpresa] = useState({});
    // Armazena categorias
    const [categorias, setCategorias] = useState([]);
    // Armazena filtro categorias
    const [filtro, setFiltro] = useState('RECEITA');
    // Loading categorias
    const [loading, setLoading] = useState(true);
    // Busca
    const [busca, setBusca] = useState('');
    // Menu para mostrar subcategorias
    const [menuAberto, setMenuAberto] = useState(null);
    const [mostrarSubcategorias, setMostrarSubCategorias] = useState(false)
    // Modais Categorias
    const [popUpCriarCategoria, setPopUpCriarCategoria] = useState(false);
    const [popUpEditarCategoria, setPopUpEditarCategoria] = useState(false);
    // Modais SubCategorias
    const [popUpCriarSubCategoria, setPopUpCriarSubCategoria] = useState(false);
    const [popUpEditarSubCategoria, setPopUpEditarSubCategoria] = useState(false);
    // Estados para categorias
    const [popUpExclusaoCategoria, setExclusaoCategoria] = useState(false)
    const [popUpExclusaoSubcategoria, setExclusaoSubcategoria] = useState(false)
    // Categoria e subcategorias selecionada
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)
    const [subCategoriaSelecionada, setSubCategoriaSelecionada] = useState(null)
    // Referencia menu de categoria aberto
    const menuCategoriaRefs = useRef({});

    // Remove Scroll da página
    useEffect(() => {
        if (popUpCriarCategoria || popUpEditarCategoria || popUpCriarSubCategoria || popUpEditarSubCategoria || popUpExclusaoCategoria || popUpExclusaoSubcategoria) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [popUpCriarCategoria || popUpEditarCategoria || popUpCriarSubCategoria || popUpEditarSubCategoria || popUpExclusaoCategoria || popUpExclusaoSubcategoria]);

    // Abre menu categoria
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                menuCategoriaRefs.current[menuAberto] &&
                !menuCategoriaRefs.current[menuAberto].contains(event.target)
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

    const handleMenuSubcategoriasClick = (index) => {
        setMostrarSubCategorias((prev) => (prev === index ? null : index));
    };

    // Campo de busca categorias
    const categoriasFiltradas = categorias?.filter(categoria => {
        const correspondeFiltro = filtro === 'RECEITA' ? categoria.tipo === "RECEITA" : filtro === 'DESPESA' ? categoria.tipo === "DESPESA" : true;
        const correspondeBuscaCategoria = categoria.name.toLowerCase().includes(busca.toLowerCase());

        // Verifica se alguma subcategoria contém o termo buscado
        const correspondeBuscaSubcategoria = categoria.subcategorias?.some(subcategoria =>
            subcategoria.name.toLowerCase().includes(busca.toLowerCase())
        );

        return correspondeFiltro && (correspondeBuscaCategoria || correspondeBuscaSubcategoria);
    });

    // Buscar categorias
    const atualizarCategorias = () => {
        if (id) {
            buscarCategoriasPorEmpresa(id, setCategorias, setLoading);
        }
    };

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        buscarEmpresa(id, setEmpresa, setLoading)
    }, [id])

    useEffect(() => {
        atualizarCategorias();
    }, [id]);

    // Criar categoria
    const criarCategoria = () => {
        setPopUpCriarCategoria(true);
    }

    // Abrir modal excluir categoria
    const handleExcluirCategoria = (categoria) => {
        setCategoriaSelecionada(categoria);
        setExclusaoCategoria(true);
    };

    // Excluir categoria
    const confirmarExcluirCategoria = async () => {
        if (!categoriaSelecionada) return;
        await excluirCategoria(categoriaSelecionada.id, id, atualizarCategorias, setExclusaoCategoria);
    }

    // Abrir modal excluir subcategoria
    const handleExcluirSubCategoria = (subcategoria) => {
        setSubCategoriaSelecionada(subcategoria);
        setExclusaoSubcategoria(true);
    };

    // Excluir subcategoria
    const confirmarExcluirSubCategoria = async () => {
        if (!subCategoriaSelecionada) return;
        await excluirSubcategoria(subCategoriaSelecionada.id, id, atualizarCategorias, setExclusaoSubcategoria);
    }

    return (
        <Layout>
            <div className="box_conteudo_paginas">
                <div className="header-paginas">
                    <div className="box-header">
                        <h2>Categorias {empresa?.name?.length > 10 ? `${empresa.name.slice(0, 10)}...` : empresa?.name}</h2>
                        <div className={styles.box_menu_pagina}>
                            <Link to="/dashboard" className={styles.link_menu_pagina}>
                                Dashboard
                            </Link>
                            <PiIcons.PiDotOutlineFill />
                            <Link to="/categorias" className={styles.link_menu_pagina}>Categorias</Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>
                                {loading ? (
                                    <Skeleton width={80} height={15} borderRadius={6} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                ) : (
                                    <span>{empresa?.name?.length > 10 ? `${empresa.name.slice(0, 10)}...` : empresa?.name}</span>
                                )}
                            </p>
                        </div>
                    </div>

                </div>

                <div className={styles.box_busca_e_btn}>
                    <Input type="text" placeholder="Buscar categoria..." value={busca} onChange={(e) => setBusca(e.target.value)} className={styles.input_busca} />
                    <div className={styles.box_opces_nova_categoria}>
                        <Link className={styles.btn_link_principal} onClick={() => criarCategoria()} ><PiIcons.PiPlusBold /> Nova categoria</Link>
                    </div>
                </div>

                <div className={styles.box_menu_categorias}>
                    <div className={styles.filtro_pagina}>
                        <Link className={`${styles.filtro_receitas} ${filtro === "RECEITA" ? styles.ativo : ''}`} onClick={() => {
                            setFiltro('RECEITA')

                        }}>
                            <PiIcons.PiArrowUpRightLight />
                            Receitas
                        </Link>
                        <Link className={`${styles.filtro_despesas} ${filtro === "DESPESA" ? styles.ativo : ''}`} onClick={() => {
                            setFiltro('DESPESA')
                        }}>
                            <PiIcons.PiArrowDownRightLight />
                            Despesas
                        </Link>
                    </div>
                </div>

                <div className={styles.categoria_header}>
                    <span>Nome</span>
                    <span title='Adicionado'>Adc...</span>
                    <span>Criação</span>
                    <span title='Subcategorias'>Sub...</span>
                    <span>Opções</span>
                </div>

                {loading ? (
                    Array.from({ length: 10 }).map((_, id) => (
                        <div key={id} className={styles.box_categorias}>

                            <div className={styles.box_categoria}>
                                <Skeleton height={25} width="100%" borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                <Skeleton height={25} width="100%" borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                <Skeleton height={25} width="100%" borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                            </div>
                        </div>
                    ))
                ) : categoriasFiltradas.length > 0 ? (
                    <div className={styles.box_categorias}>

                        {categoriasFiltradas
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((categoria, index) => (
                                <div key={categoria.id} className={`${styles.box_categoria} ${mostrarSubcategorias === index ? styles.ativo : ''}`}>
                                    <div className={styles.categoria_nome}>{capitalizeFirstLetter(categoria.name)}</div>
                                    <div className={styles.infos_adicionado}></div>
                                    <div className={styles.info_data}>{new Date(categoria.created_at).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}</div>

                                    <div className={styles.btn_subcategorias}>
                                        {categoria.subcategorias.length > 0 ? (
                                            <span onClick={() => handleMenuSubcategoriasClick(index)}>
                                                <PiIcons.PiCaretDownLight />
                                            </span>
                                        ) : ('')}
                                    </div>
                                    <div className={styles.btn_opcoes_categoria} ref={(el) => (menuCategoriaRefs.current[index] = el)}>
                                        <span onClick={() => handleMenuClick(index)}>
                                            <PiIcons.PiDotsThreeVertical />
                                        </span>
                                        <div className={`${styles.box_opcoes_categorias} ${menuAberto === index ? styles.ativo : styles.inativo}`}>
                                            <Link onClick={() => {
                                                setCategoriaSelecionada(categoria)
                                                setPopUpCriarSubCategoria(true)
                                            }}>
                                                <PiIcons.PiPlusLight className={styles.icone_box_opcoes} />
                                                <p>Incluir subcategoria</p>
                                            </Link>
                                            <Link onClick={() => {
                                                setCategoriaSelecionada(categoria)
                                                setPopUpEditarCategoria(true)
                                            }}>
                                                <PiIcons.PiNotePencilLight />
                                                <p>Editar</p>
                                            </Link>
                                            <hr />
                                            <Link className={styles.btn_excluir} onClick={() => handleExcluirCategoria({ id: categoria.id })}>
                                                <PiIcons.PiTrashLight />
                                                <p>Excluir</p>
                                            </Link>
                                        </div>
                                    </div>
                                    {mostrarSubcategorias === index && (
                                        <div className={styles.box_subcategorias}>
                                            {categoria.subcategorias
                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                .map((subcategoria) => (
                                                    <div className={styles.dados_subcategoria} key={subcategoria.id}>
                                                        <p>{capitalizeFirstLetter(subcategoria.name)}</p>
                                                        <div className={styles.box_info_adicionado}>
                                                            <span className={styles.manual}>Manual</span>
                                                        </div>
                                                        <div className={styles.info_data}>{new Date(subcategoria.created_at).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                        </div>
                                                        <span></span>
                                                        <div className={styles.box_btns_subcategorias}>
                                                            <Link className={styles.btn_editar_subcategoria}
                                                                onClick={() => {
                                                                    setSubCategoriaSelecionada(subcategoria)
                                                                    setPopUpEditarSubCategoria(true)
                                                                }}
                                                            ><PiIcons.PiNotePencilLight /></Link>
                                                            <Link className={styles.btn_excluir_subcategoria}
                                                                onClick={() => handleExcluirSubCategoria({
                                                                    id: subcategoria.id
                                                                })}
                                                            ><PiIcons.PiTrashLight /></Link>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className={styles.box_sem_categorias}>
                        {filtro === "RECEITA" ? (
                            <>
                                <span>
                                    <PiIcons.PiListMagnifyingGlassLight />
                                </span>
                                <p>Nenhuma categoria em receita!</p>
                            </>
                        ) : (
                            <>
                                <span>
                                    <PiIcons.PiListMagnifyingGlassLight />
                                </span>
                                <p>Nenhuma categoria em despesa!</p>
                            </>
                        )}
                    </div>

                )}

            </div>

            <CriarCategoria
                trigger={popUpCriarCategoria}
                setTrigger={setPopUpCriarCategoria}
                categoriaCriada={atualizarCategorias}
                empresaId={id}
            />

            <CriarSubCategoria
                trigger={popUpCriarSubCategoria}
                setTrigger={setPopUpCriarSubCategoria}
                categoria={categoriaSelecionada}
                subcategoriaCriada={atualizarCategorias}
                empresaId={id}
            />

            <EditarCategoria
                trigger={popUpEditarCategoria}
                setTrigger={setPopUpEditarCategoria}
                categoria={categoriaSelecionada}
                categoriaEditada={atualizarCategorias}
                empresaId={id}
            />

            <EditarSubCategoria
                trigger={popUpEditarSubCategoria}
                setTrigger={setPopUpEditarSubCategoria}
                subcategoria={subCategoriaSelecionada}
                subcategoriaEditada={atualizarCategorias}
                empresaId={id}
            />

            <ExcluirCategoria
                trigger={popUpExclusaoCategoria}
                setTrigger={setExclusaoCategoria}
                mensagem={<>
                    Tem certeza que deseja excluir essa categoria?
                </>}
                onConfirm={confirmarExcluirCategoria}
            />

            <ExcluirSubcategoria
                trigger={popUpExclusaoSubcategoria}
                setTrigger={setExclusaoSubcategoria}
                mensagem={<>
                    Tem certeza que deseja excluir essa subcategoria?
                </>}
                onConfirm={confirmarExcluirSubCategoria}
            />
        </Layout>
    );
};
