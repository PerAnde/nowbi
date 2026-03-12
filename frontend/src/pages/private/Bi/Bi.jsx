import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { buscarBi, atualizarStatus, gerarRelatorioAI, buscarObservacoes, salvarObservacoes, excluirBi } from '../../../services/bis';
import { excluirLancamento, excluirLancamentos } from '../../../services/lancamentos';
import { toast } from 'sonner';
import { capitalizeFirstLetter } from '../../../utils/formatUtils'

import { Layout } from '../../../layout/Layout'
import { EditorObservacoes } from "../../../components/EditorObs/EditorObs";
import { Input } from '../../../components/Input/Input';
import { EditarBi } from '../../../components/Modal/BI/EditarBi/EditarBi';
import { ExcluirBi } from '../../../components/Modal/BI/ExcluirBi/ExcluirBi';

import { CriarLancamento } from '../../../components/Modal/LancamentoBi/CriarLancamento/CriarLancamento';
import { EditarLancamento } from '../../../components/Modal/LancamentoBi/EditarLancamento/EditarLancamento';
import { ExcluirLancamento } from '../../../components/Modal/LancamentoBi/ExcluirLancamento/ExcluirLancamento';
import { ExcluirLancamentos } from '../../../components/Modal/LancamentoBi/ExcluirLancamentos/ExcluirLancamentos'

import { ImportarCSV } from '../../../components/Modal/LancamentoBi/ImportarCSV/ImportarCSV'
import { ImportacaoBling } from '../../../components/Modal/LancamentoBi/ImportacaoBling/ImportacaoBling'

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import * as PiIcons from 'react-icons/pi';

import styles from './Bi.module.scss'

export const Bi = () => {

    // Estados BI e Empresa
    const { id } = useParams();
    const [bi, setBi] = useState({ lancamentoBi: [] });
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("TODOS");
    // Busca
    const [busca, setBusca] = useState('');
    const [observacoes, setObservacoes] = useState({
        periodo_mes: "",
        resumo_geral: "",
        analise_receita: "",
        analise_despesa: "",
        pontos_atencao: "",
        recomendacoes: "",
        conclusao: "",
    });

    const hasConteudoReal = (html) => {
        if (!html) return false;

        const texto = html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, '')
            .trim();

        return texto.length > 0;
    };

    const isPreviewRelatorio = Object.values(observacoes).some(
        campo => hasConteudoReal(campo)
    );

    // Modais
    const [popUpEditarBi, setPopUpEditarBi] = useState(false);
    const [popUpExcluirBi, setPopUpExcluirBi] = useState(false);

    const [popUpNovoLancamento, setPopUpNovoLancamento] = useState(false);
    const [popUpEditarLancamento, setPopUpEditarLancamento] = useState(false);
    const [popUpExclusaoLancamento, setPopUpExclusaoLancamento] = useState(false);
    const [popUpExclusaoLancamentos, setPopUpExclusaoLancamentos] = useState(false);

    const [popUpImportarCSV, setPopUpImportarCSV] = useState(false);
    const [popUpImportacaoBling, setPopUpImportacaoBling] = useState(false);

    const navigate = useNavigate();

    // Lancamento selecionado
    const [lancamentoSelecionado, setLancamentoSelecionado] = useState(null);

    const [loadingRelatorio, setLoadingRelatorio] = useState(false);

    // Estado lancamentos selecionados
    const [lancamentosSelecionados, setLancamentosSelecionados] = useState([]);
    const lancamentoRef = useRef([]);

    // Desativa ou ativa scroll
    useEffect(() => {
        if (popUpEditarBi || popUpExcluirBi || popUpEditarLancamento || popUpNovoLancamento || popUpImportarCSV || popUpExclusaoLancamento || popUpExclusaoLancamentos) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [popUpEditarBi || popUpExcluirBi || popUpEditarLancamento || popUpNovoLancamento || popUpImportarCSV || popUpExclusaoLancamento || popUpExclusaoLancamentos]);

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setLoading(true);
            try {
                buscarBi(id, async (data) => {
                    setBi(data);

                    const obsData = await buscarObservacoes(id);

                    if (obsData) {
                        setObservacoes({
                            periodo_mes: obsData.periodo_mes || '',
                            resumo_geral: obsData.resumo_geral || '',
                            analise_receita: obsData.analise_receita || '',
                            analise_despesa: obsData.analise_despesa || '',
                            pontos_atencao: obsData.pontos_atencao || '',
                            recomendacoes: obsData.recomendacoes || '',
                            conclusao: obsData.conclusao || ''
                        });
                    }
                    setLoading(false);
                }, navigate);
            } catch (error) {
                setLoading(false);
            }
        };

        carregarDadosIniciais();
    }, [id]);

    // Pegando id da empresa
    const idEmpresa = bi?.empresa?.id;

    // Atualizar BI
    const atualizarBi = () => {
        try {
            buscarBi(id, async (data) => {
                setBi(data);

                const obsData = await buscarObservacoes(id);

                if (obsData) {
                    setObservacoes({
                        periodo_mes: obsData.periodo_mes || '',
                        resumo_geral: obsData.resumo_geral || '',
                        analise_receita: obsData.analise_receita || '',
                        analise_despesa: obsData.analise_despesa || '',
                        pontos_atencao: obsData.pontos_atencao || '',
                        recomendacoes: obsData.recomendacoes || '',
                        conclusao: obsData.conclusao || ''
                    });
                }
                setLoading(false);
            }, navigate);
        } catch (error) {
            console.error("Erro ao atualizar dados:", error);
        }
    };

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
        await excluirLancamento(lancamentoSelecionado, setPopUpExclusaoLancamento);
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

    const handleGerarRelatorio = async () => {
        if (loadingRelatorio || !id) return;

        let toastId;
        try {

            setLoadingRelatorio(true);
            toastId = toast.loading("Gerando relatório com I.A...");
            const response = await gerarRelatorioAI(id);
            const dados = response.conteudoIA || response;

            setObservacoes({
                periodo_mes: dados.periodo_mes || "",
                resumo_geral: dados.resumo_geral || "",
                analise_receita: dados.analise_receita || "",
                analise_despesa: dados.analise_despesa || "",
                pontos_atencao: dados.pontos_atencao || "",
                recomendacoes: dados.recomendacoes || "",
                conclusao: dados.conclusao || ""
            });

            toast.success("Relatório gerado com sucesso!", { id: toastId });
        } catch (error) {
            toast.error("Erro ao gerar relatório com I.A.", { id: toastId });
        } finally {
            setLoadingRelatorio(false);
        }
    };

    const handleSalvarObservacoes = async () => {
        const sucesso = await salvarObservacoes(id, observacoes);

        if (sucesso) {
            toast.success("Relatório salvo com sucesso!");
            atualizarBi();
        }
    };

    const handleFieldChange = (field, value) => {
        setObservacoes(prev => ({ ...prev, [field]: value }));
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
                                <span>{capitalizeFirstLetter(bi.mes)}/{bi.ano}</span>
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
                                <Link to={`/empresas/${bi.empresa?.id}`} className={styles.link_menu_pagina}>{capitalizeFirstLetter(bi.empresa?.name?.length > 10 ? `${bi.empresa.name.slice(0, 10)}...` : bi.empresa?.name)}</Link>
                            )}
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>
                                {loading ? (
                                    <Skeleton width={80} height={15} borderRadius={6} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                ) : (
                                    <span>{capitalizeFirstLetter(bi.mes)}/{bi.ano}</span>
                                )}
                            </p>
                        </div>
                    </div>

                </div>

                <div className={styles.filtro_busca_categoria}>
                    {filtro === "OBS" ? ('') : (<Input type="text" placeholder="Buscar lançamento..." value={busca} onChange={(e) => setBusca(e.target.value)} className={styles.input_busca} />)}
                    <>
                        {filtro === "OBS" ? (
                            <div className={styles.box_btns_obs}>
                                {!bi?.relatorio_ia_gerado && (
                                    <button
                                        className={`${styles.btn_gerar_relatorio} ${loadingRelatorio ? styles.loading : ''}`}
                                        onClick={handleGerarRelatorio}
                                        disabled={loadingRelatorio}
                                    >
                                        <span className={styles.btn_gerar_relatorio_conteudo}>
                                            <PiIcons.PiSparkle className={styles.icone_ia} />
                                            {loadingRelatorio ? "Gerando relatório..." : "Gerar com IA"}
                                        </span>
                                    </button>
                                )}
                                <Link className={styles.btn_link_principal}
                                    onClick={handleSalvarObservacoes}
                                >Salvar relatório</Link>
                            </div>
                        ) : (
                            <>
                                <div className={styles.box_btns_acao_bi}>
                                    <div className={styles.box_gerenciar_bi}>
                                        <Link className={`${styles.btn_link_principal} ${styles.btn_editar}`} onClick={() => setPopUpEditarBi(true)} title="Editar BI"><PiIcons.PiNotePencil /></Link>
                                        <Link className={`${styles.btn_link_principal} ${styles.btn_excluir}`} onClick={() => setPopUpExcluirBi(true)} title="Excluir BI"><PiIcons.PiTrash /></Link>

                                        {bi.status ? (
                                            <Link
                                                className={`${styles.btn_link_principal} ${styles.btn_reabrir}`}
                                                onClick={() => atualizarStatusBi()}
                                                title="Manter em aberto"
                                            >
                                                <PiIcons.PiArrowArcLeftLight />
                                            </Link>
                                        ) : (
                                            <Link
                                                className={`${styles.btn_link_principal} ${styles.btn_concluir}`}
                                                onClick={() => atualizarStatusBi()}
                                                title="Finalizar BI"
                                            >
                                                <PiIcons.PiChecksLight />
                                            </Link>
                                        )}
                                    </div>

                                    <div className={styles.box_importacoes_bi}>
                                        <Link className={styles.btn_link_principal}
                                            onClick={(e) => setPopUpNovoLancamento(true)}
                                            title="Adicionar lançamento"
                                        ><PiIcons.PiPlusBold /> Add</Link>
                                        <Link className={`${styles.btn_link_principal} ${styles.btn_editar}`} onClick={() => setPopUpImportarCSV(true)} title="Importar via CSV"><PiIcons.PiFileCsvBold /></Link>
                                        {bi.empresa?.blingIntegration?.isActive ? (
                                            <>
                                                <Link className={styles.btn_integrar} onClick={() => setPopUpImportacaoBling(true)} title="Importar dados do Bling!">Bling</Link>
                                            </>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>

                            </>)
                        }
                    </>
                </div>

                <div className={styles.box_menu_lancamentos}>
                    <div className={styles.filtro_pagina}>
                        <Link className={`${styles.filtro_todos} ${filtro === "TODOS" ? styles.ativo : ""}`} onClick={() => setFiltro("TODOS")}>
                            <PiIcons.PiListChecksLight />
                            Todos
                        </Link>
                        <Link className={`${styles.filtro_receitas} ${filtro === "RECEITA" ? styles.ativo : ""}`} onClick={() => setFiltro("RECEITA")}>
                            <PiIcons.PiArrowUpRightLight />
                            Receitas
                        </Link>
                        <Link className={`${styles.filtro_despesas} ${filtro === "DESPESA" ? styles.ativo : ""}`} onClick={() => setFiltro("DESPESA")}>
                            <PiIcons.PiArrowDownRightLight />
                            Despesas
                        </Link>
                        <Link className={`${styles.filtro_obs} ${filtro === "OBS" ? styles.ativo : ""}`} onClick={() => setFiltro("OBS")}>
                            <PiIcons.PiTextIndentLight />
                            Relatório
                        </Link>
                    </div>
                </div>

                {lancamentosSelecionados.length > 0 ? (
                    <div className={styles.box_excluir_lancamentos}>
                        <p><span>{lancamentosSelecionados.length}</span> Selecionados</p>
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
                        filtro === "OBS" ? (
                            <div className={styles.box_header_obs}>
                                <div className={styles.texto_header_obs}>
                                    <p>Insira suas observações ou utilize a I.A para gerar um relatório completo.</p>
                                    <p><span><PiIcons.PiInfoLight /></span> A I.A pode cometer erros ao gerar o relatório, portanto revise todas as informações.</p>
                                </div>
                            </div>
                        )
                            :
                            ('')
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
                                <p>{capitalizeFirstLetter(lancamento.categoria.name)}</p>
                                <p>{lancamento.subcategoria ? capitalizeFirstLetter(lancamento.subcategoria.name) : <span>Sem subcategoria</span>}</p>
                                <div className={styles.box_btns_opcoes_lancamento}>
                                    <Link className={styles.btn_editar_lancamento} onClick={() => {
                                        setLancamentoSelecionado(lancamento.id)
                                        setPopUpEditarLancamento(true)
                                    }}>
                                        <PiIcons.PiNotePencil />
                                    </Link>
                                    <Link className={styles.btn_excluir_lancamento} onClick={() => handleExcluirLancamento(lancamento.id)}>
                                        <PiIcons.PiTrash />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            {filtro === "TODOS" ? (
                                <div className={styles.box_sem_bi}>
                                    <span>
                                        <PiIcons.PiListMagnifyingGlassDuotone />
                                    </span>
                                    <p>Nenhum lançamento!</p>
                                </div>
                            ) : filtro === "RECEITA" ? (
                                <div className={styles.box_sem_bi}>
                                    <span>
                                        <PiIcons.PiListMagnifyingGlassDuotone />
                                    </span>
                                    <p>Nenhum lançamento em receita!</p>
                                </div>
                            ) : filtro === "DESPESA" ? (
                                <div className={styles.box_sem_bi}>
                                    <span>
                                        <PiIcons.PiListMagnifyingGlassDuotone />
                                    </span>
                                    <p>Nenhum lançamento em despesa!</p>
                                </div>
                            ) : (
                                <div className={styles.container_box_relatorio} style={{
                                    gridTemplateColumns: isPreviewRelatorio
                                        ? '1fr minmax(400px, 400px)'
                                        : '1fr'
                                }}>

                                    <div className={styles.box_editores}>
                                        <div className={styles.box_editor_obs}>
                                            <p>Período</p>
                                            <EditorObservacoes
                                                value={observacoes.periodo_mes}
                                                onChange={(val) => handleFieldChange('periodo_mes', val)}
                                            />
                                        </div>

                                        <div className={styles.box_editor_obs}>
                                            <p>Resumo Geral</p>
                                            <EditorObservacoes
                                                value={observacoes.resumo_geral}
                                                onChange={(val) => handleFieldChange('resumo_geral', val)}
                                            />
                                        </div>

                                        <div className={styles.box_editor_obs}>
                                            <p>Análise de Receitas</p>
                                            <EditorObservacoes
                                                value={observacoes.analise_receita}
                                                onChange={(val) => handleFieldChange('analise_receita', val)}
                                            />
                                        </div>

                                        <div className={styles.box_editor_obs}>
                                            <p>Análise de Despesas</p>
                                            <EditorObservacoes
                                                value={observacoes.analise_despesa}
                                                onChange={(val) => handleFieldChange('analise_despesa', val)}
                                            />
                                        </div>

                                        <div className={styles.box_editor_obs}>
                                            <p>Pontos de Atenção</p>
                                            <EditorObservacoes
                                                value={observacoes.pontos_atencao}
                                                onChange={(val) => handleFieldChange('pontos_atencao', val)}
                                            />
                                        </div>

                                        <div className={styles.box_editor_obs}>
                                            <p>Recomendações</p>
                                            <EditorObservacoes
                                                value={observacoes.recomendacoes}
                                                onChange={(val) => handleFieldChange('recomendacoes', val)}
                                            />
                                        </div>

                                        <div className={styles.box_editor_obs}>
                                            <p>Conclusão</p>
                                            <EditorObservacoes
                                                value={observacoes.conclusao}
                                                onChange={(val) => handleFieldChange('conclusao', val)}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.box_preview_relatorio} style={{ display: isPreviewRelatorio ? 'flex' : 'none' }}>
                                        <p className={styles.texto_preview}>Preview do relatório</p>

                                        <section className={styles.box_periodo_mes}>
                                            <div dangerouslySetInnerHTML={{ __html: observacoes.periodo_mes }} />
                                        </section>

                                        <section className={styles.box_resumo_geral}>
                                            <div className={styles.header_section}>
                                                <h4>Resumo Geral</h4>
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: observacoes.resumo_geral }} />
                                        </section>

                                        <section className={styles.box_receitas}>
                                            <div className={styles.header_section}>
                                                <h4>Análise de Receitas</h4>
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: observacoes.analise_receita }} />
                                        </section>

                                        <section className={styles.box_despesas}>
                                            <div className={styles.header_section}>
                                                <h4>Análise de Despesas</h4>
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: observacoes.analise_despesa }} />
                                        </section>

                                        <section className={styles.box_pontos_atencao}>
                                            <div className={styles.header_section}>
                                                <h4>Pontos de Atenção</h4>
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: observacoes.pontos_atencao }} />
                                        </section>

                                        <section className={styles.box_recomendacoes}>
                                            <div className={styles.header_section}>
                                                <h4>Recomendações</h4>
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: observacoes.recomendacoes }} />
                                        </section>

                                        <section className={styles.box_conclusao}>
                                            <div className={styles.header_section}>
                                                <h4>Conclusão</h4>
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: observacoes.conclusao }} />
                                        </section>
                                    </div>

                                </div>
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
                empresaId={idEmpresa}
                lancamentoCriado={atualizarBi} />
            <ImportarCSV
                trigger={popUpImportarCSV}
                setTrigger={setPopUpImportarCSV}
                lancamentoCriado={atualizarBi}
            />
            <ImportacaoBling
                trigger={popUpImportacaoBling}
                setTrigger={setPopUpImportacaoBling}
                empresaId={idEmpresa}
                lancamentoCriado={atualizarBi}
            />
            <EditarLancamento
                trigger={popUpEditarLancamento}
                setTrigger={setPopUpEditarLancamento}
                lancamento={lancamentoSelecionado}
                empresaId={idEmpresa}
                lancamentoEditado={atualizarBi}
            />
            <ExcluirLancamento
                trigger={popUpExclusaoLancamento}
                setTrigger={setPopUpExclusaoLancamento}
                lancamento={lancamentoSelecionado}
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
