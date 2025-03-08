import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { buscarBi, atualizarStatus, excluirBi } from '../../../services/bis';
import { toast } from 'sonner';

import { Layout } from '../../../layout/Layout'

import { CriarLancamento } from '../../../components/Modal/LancamentoBi/CriarLancamento/CriarLancamento';

import { EditarBi } from '../../../components/Modal/BI/EditarBi/EditarBi';
import { ExcluirBi } from '../../../components/Modal/BI/ExcluirBi/ExcluirBi';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import * as PiIcons from 'react-icons/pi';

import styles from './Bi.module.scss'
import { Input } from '../../../components/Input/Input';

export const Bi = () => {

    // Estados BI e Empresa
    const { id } = useParams();
    const [bi, setBi] = useState({});
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("TODOS");
    // Busca
    const [busca, setBusca] = useState('');

    const [popUpNovoLancamento, setPopUpNovoLancamento] = useState(false);
    const [popUpEditarBi, setPopUpEditarBi] = useState(false);
    const [popUpExcluirBi, setPopUpExcluirBi] = useState(false);

    const navigate = useNavigate();

    // Estado lancamentos selecionados
    const [lancamentosSelecionados, setLancamentosSelecionados] = useState([]);
    const lancamentoRef = useRef([]);

    // Desativa ou ativa scroll
    useEffect(() => {
        if (popUpEditarBi) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
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
            atualizarBi();
        } catch (error) {
            toast.error("Erro ao atualizar status do BI!");
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

    // Pegando lancamentos selecionados
    const handleLancamentoClick = (id) => {
        setLancamentosSelecionados((prevSelecionados) => {
            // Verificar se o ID já está presente na lista
            const isSelected = prevSelecionados.includes(id);

            if (isSelected) {
                // Remover o ID da lista
                return prevSelecionados.filter((itemId) => itemId !== id);
            } else {
                // Adicionar o ID à lista
                return [...prevSelecionados, id];
            }
        });
    };

    // Lancamentos filtrados
    const lancamentosFiltrados = bi.lancamentoBi
        ? bi.lancamentoBi.filter(lancamento => {
            const correspondeFiltro = filtro === "TODOS" || lancamento.tipo === filtro;

            const buscaNormalizada = busca.toLowerCase();

            // Impede a busca pelos termos "receita" ou "despesa"
            const ignorarBusca = buscaNormalizada === "receita" || buscaNormalizada === "despesa";

            const correspondeBuscaValor = !ignorarBusca && lancamento.valor?.toString().includes(busca);
            const correspondeBuscaCategoria = !ignorarBusca && lancamento.categoria?.name.toLowerCase().includes(buscaNormalizada);
            const correspondeBuscaSubcategoria = !ignorarBusca && lancamento.subcategoria?.name.toLowerCase().includes(buscaNormalizada);

            return correspondeFiltro && (correspondeBuscaValor || correspondeBuscaCategoria || correspondeBuscaSubcategoria);
        })
        : [];


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
                            <Link to={`/empresas/${bi.empresa?.id}`} className={styles.link_menu_pagina}>{bi.empresa?.name?.length > 10 ? `${bi.empresa.name.slice(0, 10)}...` : bi.empresa?.name}</Link>
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
                                        className={`${styles.btn_link_principal} ${styles.btn_reabrir}`}
                                        onClick={() => atualizarStatusBi()}
                                    >
                                        <PiIcons.PiArrowArcLeftBold /> Reabrir BI
                                    </Link>
                                ) : (
                                    <Link
                                        className={`${styles.btn_link_principal} ${styles.btn_concluir}`}
                                        onClick={() => atualizarStatusBi()}
                                    >
                                        <PiIcons.PiCheckBold /> Finalizar BI
                                    </Link>
                                )}

                            </div>

                            {bi.status ? (
                                ''
                            ) : (
                                <Link className={styles.btn_link_principal} onClick={(e) => setPopUpNovoLancamento(true)}><PiIcons.PiPlusBold /> Novo Lançamento</Link>
                            )}

                        </div>
                    </div>

                </div>

                <div className={styles.box_menu_lancamentos}>
                    <div className={styles.filtro_pagina}>
                        <Link className={`${styles.filtro_todos} ${filtro === "TODOS" ? styles.ativo : ""}`} onClick={() => setFiltro("TODOS")}>
                            <PiIcons.PiListBulletsBold />
                            Todos
                        </Link>
                        <Link className={`${styles.filtro_receitas} ${filtro === "RECEITA" ? styles.ativo : ""}`} onClick={() => setFiltro("RECEITA")}>
                            <PiIcons.PiArrowUpRightBold />
                            Receitas
                        </Link>
                        <Link className={`${styles.filtro_despesas} ${filtro === "DESPESA" ? styles.ativo : ""}`} onClick={() => setFiltro("DESPESA")}>
                            <PiIcons.PiArrowDownRightBold />
                            Despesas
                        </Link>
                    </div>

                    <div className={styles.filtro_busca_categoria}>
                        <Input type="text" placeholder="Buscar lançamento..." value={busca} onChange={(e) => setBusca(e.target.value)} className={styles.input_busca} />
                    </div>
                </div>

                {lancamentosSelecionados.length > 0 ? (
                    <div className={styles.box_excluir_lancamentos}>
                        <p>Excluir lançamentos</p>
                        <Link className={styles.btn_excluir_lancamentos}>
                            <PiIcons.PiTrashBold />
                            <p>Excluir</p>
                        </Link>
                    </div>
                ) : (
                    <div className={styles.categoria_header}>
                        <span></span>
                        <span>Valor</span>
                        <span>Tipo</span>
                        <span>Categoria</span>
                        <span>Subategoria</span>
                        <span>Opções</span>
                    </div>
                )}

                <div className={styles.box_categorias}>
                    {lancamentosFiltrados.length > 0 ? (
                        lancamentosFiltrados.map((lancamento, index) => (
                            <div key={lancamento.id || index} className={styles.box_categoria}>
                                <label className={styles.checkbox_confirmar} htmlFor={lancamento.id} ref={(el) => (lancamentoRef.current[index] = el)}>
                                    <Input
                                        type="checkbox"
                                        id={lancamento.id}
                                        className={styles.input_checkbox}
                                        checked={lancamentosSelecionados.includes(lancamento.id)}
                                        onChange={() => handleLancamentoClick(lancamento.id)}
                                    />
                                    <span className={styles.custom_checkbox}>
                                        <PiIcons.PiCheckFatFill className={styles.custom_icon} />
                                    </span>
                                </label>
                                <p>R$ {parseFloat(lancamento.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                <p className={`${styles.tipo} ${lancamento.tipo === "RECEITA" ? styles.tipo_receita : styles.tipo_despesa}`}>{capitalizeFirstLetter(lancamento.tipo)}</p>
                                <p>{lancamento.categoria.name}</p>
                                <p>{lancamento.subcategoria ? lancamento.subcategoria.name : <span>Sem subcategoria</span>}</p>
                                <div className={styles.box_btns_opcoes_lancamento}>
                                    <Link className={styles.btn_editar_lancamento}>
                                        <PiIcons.PiNotePencilBold />
                                        <p>Editar</p>
                                    </Link>
                                    <Link className={styles.btn_excluir_lancamento}>
                                        <PiIcons.PiTrashBold />
                                        <p>Excluir</p>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : null}
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
