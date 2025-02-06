import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../../layout/Layout';

import { buscarCategorias, excluirCategoria, excluirSubcategoria } from '../../../services/categorias';

import { CriarCategoria } from '../../../components/Modal/CriarCategoria/CriarCategoria';
import { EditarCategoria } from '../../../components/Modal/EditarCategoria/EditarCategoria';

import { CriarSubCategoria } from '../../../components/Modal/CriarSubCategoria/CriarSubCategoria';
import { EditarSubCategoria } from '../../../components/Modal/EditarSubCategoria/EditarSubCategoria';

import { ModalConfirmacao } from '../../../components/Modal/Confirmacao/ModalConfirmacao';
import { ModalConfirmacaoSubcategoria } from '../../../components/Modal/ConfirmacaoSubcategoria/ModalConfirmacaoSubcategoria';

import * as PiIcons from 'react-icons/pi';
import styles from './Categorias.module.scss';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

export const Categorias = () => {

    const [categorias, setCategorias] = useState([]);
    const [filtroAtivo, setFiltroAtivo] = useState('RECEITA')
    const [loading, setLoading] = useState(true);

    const [menuAberto, setMenuAberto] = useState(null);
    const [mostrarSubcategorias, setMostrarSubCategorias] = useState(false)

    const [popUpNovaCategoria, setPopUpNovaCategoria] = useState(false);
    const [popUpEditarCategoria, setPopUpEditarCategoria] = useState(false);

    const [popUpCriarSubCategoria, setPopUpCriarSubCategoria] = useState(false);
    const [popUpEditarSubCategoria, setPopUpEditarSubCategoria] = useState(false);

    // Estados para categorias
    const [modalConfirmacao, setModalConfirmacao] = useState(false)
    const [modalConfirmacaoSubcategoria, setModalConfirmacaoSubcategoria] = useState(false)
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)

    const [subCategoriaSelecionada, setSubCategoriaSelecionada] = useState(null)

    const menuCategoriaRefs = useRef([]);

    useEffect(() => {
        if (popUpNovaCategoria) {
            document.body.style.overflow = 'hidden'; // Desativa o scroll
        } else {
            document.body.style.overflow = 'auto'; // Restaura o scroll
        }
    }, [popUpNovaCategoria]);

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
        buscarCategorias(filtroAtivo, setCategorias, setLoading);
    }, [filtroAtivo])

    // Criar categoria
    const criarCategoria = () => {
        setPopUpNovaCategoria(true);
    }

    // Abrir modal de confirmacao
    const handleModalConfirmacao = (categoria) => {
        setCategoriaSelecionada(categoria);
        setModalConfirmacao(true);
    };

    // Excluir categoria
    const handleConfirmarExclusao = async () => {
        if (!categoriaSelecionada) return;
        await excluirCategoria(categoriaSelecionada.id, () => buscarCategorias(filtroAtivo, setCategorias, setLoading), setModalConfirmacao);
    }

    const handleModalConfirmacaoSubCategoria = (subcategoria) => {
        setSubCategoriaSelecionada(subcategoria);
        setModalConfirmacaoSubcategoria(true);
    };

    // Excluir subcategoria
    const handleConfirmarExclusaoSubCategoria = async () => {
        if(!subCategoriaSelecionada) return;
        await excluirSubcategoria(subCategoriaSelecionada.id, () => buscarCategorias(filtroAtivo, setCategorias, setLoading), setModalConfirmacaoSubcategoria);
    }

    return (
        <Layout>
            <div className="box_conteudo_paginas">
                <div className="header-paginas">
                    <div className="box-header direito">
                        <h2>Categorias</h2>
                        <div className={styles.box_menu_pagina}>
                            <Link to="/dashboard" className={styles.link_menu_pagina}>
                                Dashboard
                            </Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Categorias</p>
                        </div>
                    </div>

                    {categorias.length > 0 ? (
                        <div className="box-header esquerdo">
                            <Link className={styles.btn_link_principal} onClick={() => criarCategoria()} ><PiIcons.PiPlusBold /> Nova categoria</Link>
                        </div>
                    ) : ('')}

                </div>

                <div className={styles.box_menu_categorias}>
                    <div className={styles.filtro_pagina}>
                        <Link className={`${styles.filtro_receitas} ${filtroAtivo === 'RECEITA' ? styles.ativo : ''}`} onClick={() => {
                            setLoading(true)
                            setFiltroAtivo('RECEITA')
                        }}>Receitas</Link>
                        <Link className={`${styles.filtro_despesas} ${filtroAtivo === 'DESPESA' ? styles.ativo : ''}`} onClick={() => {
                            setLoading(true)
                            setFiltroAtivo('DESPESA')
                        }}>Despesas</Link>
                    </div>
                    <div className={styles.btn_atualizar} onClick={() => buscarCategorias(filtroAtivo, setCategorias, setLoading)}>
                        <PiIcons.PiArrowsClockwiseBold />
                        <p>Atualizar</p>
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
                ) : categorias.length > 0 ? (
                    <div className={styles.box_categorias}>

                        {categorias.map((categoria, index) => (
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
                                        <Link className={styles.btn_excluir} onClick={() => handleModalConfirmacao({ id: categoria.id, name: categoria.name })}>
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
                                                    onClick={() => handleModalConfirmacaoSubCategoria({
                                                        id: subcategoria.id, name: subcategoria.name
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
                        <p>Nenhuma categoria cadastrada!<br></br>Clique no botão abaixo para cadastrar uma nova.</p>
                        <Link className={styles.btn_link_principal} onClick={() => setPopUpNovaCategoria(true)}><PiIcons.PiPlusBold /> Nova categoria</Link>
                    </div>
                )}

            </div>

            <CriarCategoria trigger={popUpNovaCategoria} setTrigger={setPopUpNovaCategoria} />

            <CriarSubCategoria
                trigger={popUpCriarSubCategoria}
                setTrigger={setPopUpCriarSubCategoria}
                categoria={categoriaSelecionada}
            />

            <EditarCategoria
                trigger={popUpEditarCategoria}
                setTrigger={setPopUpEditarCategoria}
                categoria={categoriaSelecionada}
            />

            <EditarSubCategoria
                trigger={popUpEditarSubCategoria}
                setTrigger={setPopUpEditarSubCategoria}
                subcategoria={subCategoriaSelecionada}
            />

            <ModalConfirmacao
                trigger={modalConfirmacao}
                setTrigger={setModalConfirmacao}
                mensagem={<>
                    Tem certeza que deseja excluir essa categoria?
                </>}
                onConfirm={handleConfirmarExclusao}
            />

            <ModalConfirmacaoSubcategoria
                trigger={modalConfirmacaoSubcategoria}
                setTrigger={setModalConfirmacaoSubcategoria}
                mensagem={<>
                    Tem certeza que deseja excluir essa subcategoria?
                </>}
                onConfirm={handleConfirmarExclusaoSubCategoria}
            />
        </Layout>
    );
};
