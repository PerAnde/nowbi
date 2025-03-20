import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { buscarBi, atualizarStatus, excluirBi } from '../../../services/bis';
import { excluirLancamento, excluirLancamentos } from '../../../services/lancamentos';
import { toast } from 'sonner';
import { capitalizeFirstLetter } from '../../../utils/formatUtils'

import { Layout } from '../../../layout/Layout'

import { EditarBi } from '../../../components/Modal/BI/EditarBi/EditarBi';
import { ExcluirBi } from '../../../components/Modal/BI/ExcluirBi/ExcluirBi';

import { CriarLancamento } from '../../../components/Modal/LancamentoBi/CriarLancamento/CriarLancamento';
import { EditarLancamento } from '../../../components/Modal/LancamentoBi/EditarLancamento/EditarLancamento';
import { ExcluirLancamento } from '../../../components/Modal/LancamentoBi/ExcluirLancamento/ExcluirLancamento';
import { ExcluirLancamentos } from '../../../components/Modal/LancamentoBi/ExcluirLancamento/ExcluirLancamento';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import * as PiIcons from 'react-icons/pi';

import styles from './Bi.module.scss'
import { Input } from '../../../components/Input/Input';

export const Bi = () => {

    // Estados BI e Empresa
    const { id } = useParams();
    const [bi, setBi] = useState({ lancamentoBi: [] });
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("TODOS");
    // Busca
    const [busca, setBusca] = useState('');

    // Modais
    const [popUpEditarBi, setPopUpEditarBi] = useState(false);
    const [popUpExcluirBi, setPopUpExcluirBi] = useState(false);

    const [popUpNovoLancamento, setPopUpNovoLancamento] = useState(false);
    const [popUpEditarLancamento, setPopUpEditarLancamento] = useState(false);
    const [popUpExclusaoLancamento, setPopUpExclusaoLancamento] = useState(false);
    const [popUpExclusaoLancamentos, setPopUpExclusaoLancamentos] = useState(false);

    const navigate = useNavigate();

    // Lancamento selecionado
    const [lancamentoSelecionado, setLancamentoSelecionado] = useState(null);

    // Estado lancamentos selecionados
    const [lancamentosSelecionados, setLancamentosSelecionados] = useState([]);
    const lancamentoRef = useRef([]);

    // Desativa ou ativa scroll
    useEffect(() => {
        if (popUpEditarBi || popUpExcluirBi || popUpEditarLancamento || popUpNovoLancamento || popUpExclusaoLancamento || popUpExclusaoLancamentos) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [popUpEditarBi || popUpExcluirBi || popUpEditarLancamento || popUpNovoLancamento || popUpExclusaoLancamento || popUpExclusaoLancamentos]);

    useEffect(() => {
        buscarBi(id, setBi, setLoading, navigate)
    }, [id])

    // Pegando id da empresa
    const idEmpresa = bi?.empresa?.id;

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
        ? bi.lancamentoBi
            .filter(lancamento => {
                const correspondeFiltro = filtro === "TODOS" || lancamento.tipo === filtro;
                const buscaNormalizada = busca.toLowerCase();
                const ignorarBusca = buscaNormalizada === "receita" || buscaNormalizada === "despesa";
                const correspondeBuscaValor = !ignorarBusca && lancamento.valor?.toString().includes(busca);
                const correspondeBuscaCategoria = !ignorarBusca && lancamento.categoria?.name.toLowerCase().includes(buscaNormalizada);
                const correspondeBuscaSubcategoria = !ignorarBusca && lancamento.subcategoria?.name.toLowerCase().includes(buscaNormalizada);

                return correspondeFiltro && (correspondeBuscaValor || correspondeBuscaCategoria || correspondeBuscaSubcategoria);
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : [];

    const totalReceitas = bi.lancamentoBi
        ?.filter(lancamento => lancamento.tipo === "RECEITA")
        .reduce((acc, lancamento) => acc + Number(lancamento.valor || 0), 0) || 0;

    const totalDespesas = bi.lancamentoBi
        ?.filter(lancamento => lancamento.tipo === "DESPESA")
        .reduce((acc, lancamento) => acc + Number(lancamento.valor || 0), 0) || 0;

    const totalFiltrado = filtro === "RECEITA"
        ? totalReceitas
        : filtro === "DESPESA"
            ? totalDespesas
            : totalReceitas + totalDespesas;


    // Abrir modal excluir lancamento
    const handleExcluirLancamento = (lancamento) => {
        setLancamentoSelecionado(lancamento);
        setPopUpExclusaoLancamento(true);
    };

    // Excluir lancamento
    const confirmarExcluirLancamento = async () => {
        if (!lancamentoSelecionado) return;
        await excluirLancamento(lancamentoSelecionado.id, setPopUpExclusaoLancamento);
        atualizarBi();
    }

    // Abrir modal excluir lancamentos
    const handleExcluirLancamentos = () => {
        if (lancamentosSelecionados.length === 0) return;
        setPopUpExclusaoLancamentos(true);
    };

    const confirmarExcluirLancamentos = async () => {
        if (lancamentosSelecionados.length === 0) return;

        await excluirLancamentos(lancamentosSelecionados, setPopUpExclusaoLancamentos);
        setPopUpExclusaoLancamentos(false);
        setLancamentosSelecionados([]);
        atualizarBi();

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
                            {loading ? (
                                <Skeleton width={100} height={15} borderRadius={6} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                            ) : (
                                <Link to={`/empresas/${bi.empresa?.id}`} className={styles.link_menu_pagina}>{bi.empresa?.name?.length > 10 ? `${bi.empresa.name.slice(0, 10)}...` : bi.empresa?.name}</Link>
                            )}
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>
                                {loading ? (
                                    <Skeleton width={80} height={15} borderRadius={6} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
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
                        <Link className={styles.btn_excluir_lancamentos} onClick={handleExcluirLancamentos}>
                            <PiIcons.PiTrashBold />
                            <p>Excluir</p>
                        </Link>
                    </div>
                ) : (
                    lancamentosFiltrados.length > 0 ? (
                        <div className={styles.categoria_header}>
                            <span></span>
                            <span>Valor</span>
                            <span>Tipo</span>
                            <span>Categoria</span>
                            <span>Subategoria</span>
                            <span>Opções</span>
                        </div>
                    ) : (
                        ''
                    )
                )}

                <div className={styles.box_categorias}>
                    {loading ? (
                        Array.from({ length: 12 }).map((_, id) => (
                            <div key={id} className={styles.box_categoria}>
                                <Skeleton width={25} height={25} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                <Skeleton width={120} height={25} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                <Skeleton width={70} height={25} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                <Skeleton width={110} height={25} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                <Skeleton width={110} height={25} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                <Skeleton width={200} height={25} borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                            </div>
                        ))
                    ) : lancamentosFiltrados.length > 0 ? (
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
                                    <Link className={styles.btn_editar_lancamento} onClick={() => {
                                        setLancamentoSelecionado(lancamento)
                                        setPopUpEditarLancamento(true)
                                    }}>
                                        <PiIcons.PiNotePencilBold />
                                        <p>Editar</p>
                                    </Link>
                                    <Link className={styles.btn_excluir_lancamento} onClick={() => handleExcluirLancamento({ id: lancamento.id })}>
                                        <PiIcons.PiTrashBold />
                                        <p>Excluir</p>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.box_sem_bi}>
                            {filtro === "TODOS" ? (
                                <>
                                    <span>
                                        <PiIcons.PiListMagnifyingGlassDuotone />
                                    </span>
                                    <p>Nenhum lançamento!</p>
                                </>
                            ) : filtro === "RECEITA" ? (
                                <>
                                    <span>
                                        <PiIcons.PiListMagnifyingGlassDuotone />
                                    </span>
                                    <p>Nenhum lançamento em receita!</p>
                                </>
                            ) : (
                                <>
                                    <span>
                                        <PiIcons.PiListMagnifyingGlassDuotone />
                                    </span>
                                    <p>Nenhum lançamento em despesa!</p>
                                </>
                            )}
                        </div>
                    )}

                    {lancamentosFiltrados.length > 0 ? (
                        <div className={styles.box_total_lancamentos}>
                            {filtro === "TODOS" ? (
                                <p>Total de lançamentos</p>
                            ) : filtro === "RECEITA" ? (
                                <p>Total de receitas</p>
                            ) : (
                                <p>Total de despesas</p>
                            )}
                            <p><strong>{totalFiltrado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
                        </div>
                    ) : (
                        ''
                    )}

                </div>

            </div>

            <EditarBi
                trigger={popUpEditarBi}
                setTrigger={setPopUpEditarBi}
                biEditado={atualizarBi} />
            <ExcluirBi
                trigger={popUpExcluirBi}
                setTrigger={setPopUpExcluirBi}
                mensagem={<>Todos os dados desse <strong>BI</strong> serão <strong>excluídos permanentemente!</strong></>}
                onConfirm={confirmarExclusao}
                biExcluido={idEmpresa}
            />
            <CriarLancamento
                trigger={popUpNovoLancamento}
                setTrigger={setPopUpNovoLancamento}
                lancamentoCriado={atualizarBi} />
            <EditarLancamento
                trigger={popUpEditarLancamento}
                setTrigger={setPopUpEditarLancamento}
                lancamento={lancamentoSelecionado}
                lancamentoEditado={atualizarBi}
            />
            <ExcluirLancamento
                trigger={popUpExclusaoLancamento}
                setTrigger={setPopUpExclusaoLancamento}
                mensagem={<>Tem certeza que deseja excluir esse lançamento?</>}
                onConfirm={confirmarExcluirLancamento}
            />
            <ExcluirLancamentos
                trigger={popUpExclusaoLancamentos}
                setTrigger={setPopUpExclusaoLancamentos}
                mensagem={<>Tem certeza que deseja excluir esses lançamentos?</>}
                onConfirm={confirmarExcluirLancamentos}
            />


        </Layout>
    )
}
