import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../../layout/Layout';

import { buscarCategorias, excluirCategoria } from '../../../services/categorias';
import { excluirSubcategoria } from '../../../services/subcategorias';

import { CriarCategoria } from '../../../components/Modal/Categorias/CriarCategoria/CriarCategoria';
import { EditarCategoria } from '../../../components/Modal/Categorias/EditarCategoria/EditarCategoria';
import { ExcluirCategoria } from '../../../components/Modal/Categorias/ExcluirCategoria/ExcluirCategoria';

import { CriarSubCategoria } from '../../../components/Modal/Subcategorias/CriarSubCategoria/CriarSubCategoria';
import { EditarSubCategoria } from '../../../components/Modal/Subcategorias/EditarSubCategoria/EditarSubCategoria';
import { ExcluirSubcategoria } from '../../../components/Modal/Subcategorias/ExcluirSubcategoria/ExcluirSubcategoria';

import * as PiIcons from 'react-icons/pi';
import styles from './Categorias.module.scss';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

export const Categorias = () => {

    // Armazena categorias
    const [categorias, setCategorias] = useState([]);
    // Armazena filtro categorias
    const [filtro, setFiltro] = useState('RECEITA');
    // Loading categorias
    const [loading, setLoading] = useState(true);
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
    const [exclusaoCategoria, setExclusaoCategoria] = useState(false)
    const [exclusaoSubcategoria, setExclusaoSubcategoria] = useState(false)
    // Categoria e subcategorias selecionada
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)
    const [subCategoriaSelecionada, setSubCategoriaSelecionada] = useState(null)
    // Referencia menu de categoria aberto
    const menuCategoriaRefs = useRef({});

    // Remove Scroll da página
    useEffect(() => {
        if (popUpCriarCategoria) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [popUpCriarCategoria]);

    // Filtra categorias
    const categoriasFiltradas = categorias?.filter(categoria => {
        if (filtro === 'RECEITA') return categoria.tipo === "RECEITA";
        if (filtro === 'DESPESA') return categoria.tipo === "DESPESA";
        return true;
    })

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

    // Buscar categorias
    useEffect(() => {
        buscarCategorias(setCategorias, setLoading);
    }, [])

    // Atualizar categorias
    const atualizarCategorias = () => {
        buscarCategorias(setCategorias, setLoading);
    }

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
        await excluirCategoria(categoriaSelecionada.id, () => buscarCategorias(filtroAtivo, setCategorias, setLoading), setExclusaoCategoria);
    }

    // Abrir modal excluir subcategoria
    const handleExcluirSubCategoria = (subcategoria) => {
        setSubCategoriaSelecionada(subcategoria);
        setExclusaoSubcategoria(true);
    };

    // Excluir subcategoria
    const confirmarExcluirSubCategoria = async () => {
        if (!subCategoriaSelecionada) return;
        await excluirSubcategoria(subCategoriaSelecionada.id, () => buscarCategorias(filtroAtivo, setCategorias, setLoading), setExclusaoSubcategoria);
    }

    return (
        <Layout>
            <div className="box_conteudo_paginas">
                <div className="header-paginas">
                    <div className="box-header esquerdo">
                        <h2>Categorias</h2>
                        <div className={styles.box_menu_pagina}>
                            <Link to="/dashboard" className={styles.link_menu_pagina}>
                                Dashboard
                            </Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Categorias</p>
                        </div>
                    </div>

                    <div className="box-header direito">
                        <Link className={styles.btn_link_principal} onClick={() => criarCategoria()} ><PiIcons.PiPlusBold /> Nova categoria</Link>
                    </div>

                </div>

                <div className={styles.box_menu_categorias}>
                    <div className={styles.filtro_pagina}>
                        <Link className={`${styles.filtro_receitas} ${filtro === "RECEITA" ? styles.ativo : ''}`} onClick={() => {
                            setFiltro('RECEITA')

                        }}>
                            <PiIcons.PiArrowUpRightBold />
                            Receitas
                        </Link>
                        <Link className={`${styles.filtro_despesas} ${filtro === "DESPESA" ? styles.ativo : ''}`} onClick={() => {
                            setFiltro('DESPESA')
                        }}>
                            <PiIcons.PiArrowDownRightBold />
                            Despesas
                        </Link>
                    </div>
                </div>

                <div className={styles.categoria_header}>
                    <span>Nome</span>
                    <span>Subcategorias</span>
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

                        {categoriasFiltradas.map((categoria, index) => (
                            <div key={categoria.id} className={`${styles.box_categoria} ${mostrarSubcategorias === index ? styles.ativo : ''}`}>
                                <div className={styles.categoria_nome}>{categoria.name}</div>

                                <div className={styles.btn_subcategorias}>
                                    {categoria.subcategorias.length > 0 ? (
                                        <span onClick={() => handleMenuSubcategoriasClick(index)}>
                                            <PiIcons.PiCaretDownBold />
                                        </span>
                                    ) : ('')}
                                </div>
                                <div className={styles.btn_opcoes_categoria} ref={(el) => (menuCategoriaRefs.current[index] = el)}>
                                    <span onClick={() => handleMenuClick(index)}>
                                        <PiIcons.PiDotsThreeVerticalBold />
                                    </span>
                                    <div className={`${styles.box_opcoes_categorias} ${menuAberto === index ? styles.ativo : styles.inativo}`}>
                                        <Link onClick={() => {
                                            setCategoriaSelecionada(categoria)
                                            setPopUpCriarSubCategoria(true)
                                        }}>
                                            <PiIcons.PiPlusBold className={styles.icone_box_opcoes} />
                                            <p>Adicionar subcategoria</p>
                                        </Link>
                                        <Link onClick={() => {
                                            setCategoriaSelecionada(categoria)
                                            setPopUpEditarCategoria(true)
                                        }}>
                                            <PiIcons.PiNotePencilBold />
                                            <p>Editar</p>
                                        </Link>
                                        <hr />
                                        <Link className={styles.btn_excluir} onClick={() => handleExcluirCategoria({ id: categoria.id })}>
                                            <PiIcons.PiTrashBold />
                                            <p>Excluir</p>
                                        </Link>
                                    </div>
                                </div>
                                {mostrarSubcategorias === index && (
                                    <div className={styles.box_subcategorias}>
                                        {categoria.subcategorias.map((subcategoria) => (
                                            <div className={styles.dados_subcategoria} key={subcategoria.id}>
                                                <p>{subcategoria.name}</p>
                                                <Link className={styles.btn_editar_subcategoria}
                                                    onClick={() => {
                                                        setSubCategoriaSelecionada(subcategoria)
                                                        setPopUpEditarSubCategoria(true)
                                                    }}
                                                ><PiIcons.PiNotePencilBold /> Editar</Link>
                                                <Link className={styles.btn_excluir_subcategoria}
                                                    onClick={() => handleExcluirSubCategoria({
                                                        id: subcategoria.id
                                                    })}
                                                ><PiIcons.PiTrashBold /> Excluir</Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.box_sem_categorias}>
                        <span>
                            <PiIcons.PiListMagnifyingGlassDuotone />
                        </span>
                        <p>Nenhuma categoria cadastrada!</p>
                    </div>
                )}

            </div>

            <CriarCategoria
                trigger={popUpCriarCategoria}
                setTrigger={setPopUpCriarCategoria}
                categoriaCriada={atualizarCategorias}
            />

            <CriarSubCategoria
                trigger={popUpCriarSubCategoria}
                setTrigger={setPopUpCriarSubCategoria}
                categoria={categoriaSelecionada}
                subcategoriaCriada={atualizarCategorias}
            />

            <EditarCategoria
                trigger={popUpEditarCategoria}
                setTrigger={setPopUpEditarCategoria}
                categoria={categoriaSelecionada}
                categoriaEditada={atualizarCategorias}
            />

            <EditarSubCategoria
                trigger={popUpEditarSubCategoria}
                setTrigger={setPopUpEditarSubCategoria}
                subcategoria={subCategoriaSelecionada}
                subcategoriaEditada={atualizarCategorias}
            />

            <ExcluirCategoria
                trigger={exclusaoCategoria}
                setTrigger={setExclusaoCategoria}
                mensagem={<>
                    Tem certeza que deseja excluir essa categoria?
                </>}
                onConfirm={confirmarExcluirCategoria}
            />

            <ExcluirSubcategoria
                trigger={exclusaoSubcategoria}
                setTrigger={setExclusaoSubcategoria}
                mensagem={<>
                    Tem certeza que deseja excluir essa subcategoria?
                </>}
                onConfirm={confirmarExcluirSubCategoria}
            />
        </Layout>
    );
};
