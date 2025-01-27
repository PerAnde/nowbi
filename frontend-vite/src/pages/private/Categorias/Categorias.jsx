import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';

import { Layout } from '../../../layout/Layout';
import { CriarCategoria } from '../../../components/Forms/CriarCategoria/CriarCategoria';

import * as PiIcons from 'react-icons/pi';
import styles from './Categorias.module.scss';

export const Categorias = () => {

    const [categorias, setCategorias] = useState([]);
    const [filtroAtivo, setFiltroAtivo] = useState('RECEITA')

    const [menuAberto, setMenuAberto] = useState(null);
    const [mostrarSubcategorias, setMostrarSubCategorias] = useState(false)

    const [popUpNovaCategoria, setPopUpNovaCategoria] = useState(false);

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

    const buscarCategorias = async () => {
        try {
            const response = await api.get('/categorias', {
                params: { tipo: filtroAtivo },
            });
            setCategorias(response.data);

            console.log(response.data)

        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    useEffect(() => {
        buscarCategorias();
    }, [filtroAtivo]);

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
                    <div className="box-header esquerdo">
                        <Link className={styles.btn_link_principal} onClick={() => setPopUpNovaCategoria(true)} ><PiIcons.PiPlusBold /> Nova categoria</Link>
                    </div>
                </div>

                <div className={styles.filtro_pagina}>
                    <Link className={`${styles.filtro_receitas} ${filtroAtivo === 'RECEITA' ? styles.ativo : ''}`} onClick={() => setFiltroAtivo('RECEITA')}>Receitas</Link>
                    <Link className={`${styles.filtro_despesas} ${filtroAtivo === 'DESPESA' ? styles.ativo : ''}`} onClick={() => setFiltroAtivo('DESPESA')}>Despesas</Link>
                </div>

                <div className={styles.box_categorias}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Subcategorias</th>
                                <th>Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((categoria, index) => (
                                <>
                                    <tr key={categoria.id} className={`${styles.box_categoria} ${mostrarSubcategorias === index ? styles.ativo : ''}`}>
                                        <td>{categoria.name}</td>
                                        <td className={styles.btn_subcategorias}>
                                            {categoria.subcategorias.length > 0 ? (
                                                <span onClick={() => handleMenuSubcategoriasClick(index)}>
                                                    <PiIcons.PiCaretDownBold />
                                                </span>
                                            ) : ('')}
                                        </td>
                                        <td className={styles.btn_opcoes_categoria} ref={(el) => (menuCategoriaRefs.current[index] = el)}>
                                            <span onClick={() => handleMenuClick(index)}>
                                                <PiIcons.PiDotsThreeVerticalBold />
                                            </span>
                                            <div className={`${styles.box_opcoes_categorias} ${menuAberto === index ? styles.ativo : styles.inativo}`}>
                                                <Link>
                                                    <PiIcons.PiPlusBold className={styles.icone_box_opcoes} />
                                                    <p>Adicionar subcategoria</p>
                                                </Link>
                                                <Link>
                                                    <PiIcons.PiNotePencilBold />
                                                    <p>Editar</p>
                                                </Link>
                                                <hr />
                                                <Link className={styles.btn_excluir}>
                                                    <PiIcons.PiTrashBold />
                                                    <p>Excluir</p>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={`${styles.box_subcategorias} ${mostrarSubcategorias === index ? styles.ativo : styles.inativo}`} >
                                            {categoria.subcategorias.length > 0 ? (
                                                categoria.subcategorias.map((subcategoria) => (
                                                    <div className={styles.dados_subcategoria}>
                                                        <p key={subcategoria.id}>{subcategoria.name}</p>
                                                        <p className={styles.btn_editar_subcategoria}><PiIcons.PiNotePencilBold /> Editar</p>
                                                        <p className={styles.btn_excluir_subcategoria}><PiIcons.PiTrashBold /> Excluir</p>
                                                    </div>
                                                ))
                                            ) : (
                                                ''
                                            )}
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CriarCategoria trigger={popUpNovaCategoria} setTrigger={setPopUpNovaCategoria} />
        </Layout>
    );
};
