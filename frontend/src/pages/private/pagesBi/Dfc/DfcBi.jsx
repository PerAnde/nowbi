// src/pages/public/DashboardBi/ResumoBi.jsx
import React, { useState, useEffect } from 'react'

import { useBiPublic } from '../../../../contexts/BiPublicContext'

import { api } from '../../../../api/api'

import { InfoResumoBi } from '../../../../components/Modal/InfosResumoBi/InfoResumoBi'
import { FiltroDashboardBi } from '../../../../components/Selects/FiltroDashboardBi'

import { agruparPorGrupo } from '../../../../utils/agruparPorGrupo'
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'
import { agruparDadosDfc } from '../../../../utils/agruparDadosDFC'
import { INFO_METRICAS } from '../../../../utils/infoMetricasResumo'
import { salvarDFC } from '../../../../utils/salvarPDF'

import empresaSemLogo from '../../../../assets/images/imgEmpresaSemLogo.jpg'

import styles from './DfcBi.module.scss'
import './dfc.css'
import * as PiIcons from 'react-icons/pi'

export const DfcBi = () => {
    
    const {
        empresa,
        mesSelecionado,
        anoSelecionado,
        setMesSelecionado,
        setAnoSelecionado,
        anosDisponiveis,
        loading,
        dashboardData,
    } = useBiPublic()

    const [popUpInfoResumoBi, setPopUpInfoResumoBi] = useState(null)

    if (loading || !dashboardData) return <p>Carregando...</p>

    const aplicarFiltro = (novoMes, novoAno) => {
        setMesSelecionado(novoMes);
        setAnoSelecionado(novoAno);
    };

    const { summary } = dashboardData

    // Dados para gerar calculos
    const dadosAgrupados = agruparPorGrupo(dashboardData.summary.detalhes);
    const getTotal = (grupo) => dadosAgrupados[grupo]?.total || 0;

    const receitaBruta = getTotal('RECEITA_OPERACIONAL_BRUTA');
    const deducoesImpostos = getTotal('DEDUCOES_DA_RECEITA_BRUTA');
    const custoVariavel = getTotal('CUSTO_VARIAVEL');
    const despesasVariaveis = getTotal('DESPESAS_VARIAVEIS');
    const despesasOperacionais = getTotal('DESPESAS_OPERACIONAIS');
    const despesasFinanceiras = getTotal('DESPESAS_FINANCEIRAS');

    // Calculo margem de contribuicao
    const resultadoBruto = receitaBruta - deducoesImpostos - custoVariavel
    const margemDeContribuicao = resultadoBruto - despesasVariaveis;
    const margemDeContribuicaoDecimal = receitaBruta > 0 ? (margemDeContribuicao / receitaBruta) : 0;
    const margemDeContribuicaoPercentual = (margemDeContribuicaoDecimal * 100).toFixed(2);
    const margemDeContribuicaoArredondadaDecimal = Number(margemDeContribuicaoPercentual) / 100;

    // Calculo ponto de equilibrio operacional
    const pontoDeEquilibrioOperacional = margemDeContribuicaoDecimal > 0
        ? (despesasOperacionais / margemDeContribuicaoArredondadaDecimal)
        : 0;

    // Calceulo ponto de equilibrio financeiro
    const somaDepesasOperacionaisEFinanceiras = despesasOperacionais + despesasFinanceiras;
    const pontoDeEquilibrioFinanceiro = somaDepesasOperacionaisEFinanceiras / margemDeContribuicaoArredondadaDecimal;

    const dadosFiltrados = agruparDadosDfc(dashboardData.summary.detalhes);

    return (
        <div className={styles.box_dashboard_bi}>

            <div className={styles.header_pagina_dashboardBi}>
                <h3>DFC {capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</h3>

                <div className={styles.filtros_mes_ano}>
                    <FiltroDashboardBi
                        empresa={empresa}
                        mesAtivo={mesSelecionado}
                        anoAtivo={anoSelecionado}
                        anosDisponiveis={anosDisponiveis}
                        onAplicar={aplicarFiltro}
                    />
                </div>
            </div>

            <div className={styles.box_pagina_bi}>

                <div className={styles.box_metricas_mes}>

                    <div className={styles.card_metrica_mes}>
                        <div className={styles.infos_metricas_mes}>
                            <p className={styles.titulo_card_mes}>Margem de contribuição</p>
                            <h3>{margemDeContribuicao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <span>({margemDeContribuicaoPercentual}%)</span></h3>
                        </div>
                        <div className={styles.box_btn_mais_infos} onClick={() => setPopUpInfoResumoBi(INFO_METRICAS.margem_contribuicao)}>
                            <span>
                                <PiIcons.PiInfo />
                                <p>Mais informações</p>
                            </span>
                        </div>
                    </div>

                    <div className={styles.card_metrica_mes}>
                        <div className={styles.infos_metricas_mes}>
                            <p className={styles.titulo_card_mes}>Ponto de Equilíbrio Operacional</p>
                            <h3>{pontoDeEquilibrioOperacional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        </div>
                        <div className={styles.box_btn_mais_infos} onClick={() => setPopUpInfoResumoBi(INFO_METRICAS.ponto_equilibrio_op)}>
                            <span>
                                <PiIcons.PiInfo />
                                <p>Mais informações</p>
                            </span>
                        </div>
                    </div>

                    <div className={styles.card_metrica_mes}>
                        <div className={styles.infos_metricas_mes}>
                            <p className={styles.titulo_card_mes}>Ponto de Equilíbrio Financeiro</p>
                            <h3>{pontoDeEquilibrioFinanceiro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        </div>
                        <div className={styles.box_btn_mais_infos} onClick={() => setPopUpInfoResumoBi(INFO_METRICAS.ponto_equilibrio_fin)}>
                            <span>
                                <PiIcons.PiInfo />
                                <p>Mais informações</p>
                            </span>
                        </div>
                    </div>

                </div>

                <div className={styles.box_topo_dre}>
                    <div className={styles.box_btns_salvar}>
                        <button onClick={salvarDFC}>Salvar DFC</button>
                    </div>
                </div>

                <div className="dreContainer">

                    <div className="wrapper_dre">

                        <div className="box_resultados_dre">

                            <div className="box_infos_empresa">
                                <div className="box_logo_empresa">
                                    <img
                                        src={empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : empresaSemLogo}
                                        alt="Logo Empresa"
                                    />
                                    <p>Demonstrativo de <br></br>Fluxo de Caixa</p>
                                </div>

                                <div className="box_infos">
                                    <p>{capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</p>
                                </div>
                            </div>

                            <div className="box_header_dre">
                                <div className="header_resultado">
                                    <div className="resultado_titulo">
                                        <p><strong>Descrição</strong></p>
                                    </div>
                                    <div className="resultado_total">
                                        <p><strong>Total (R$)</strong></p>
                                    </div>
                                    <div className="resultado_porcentagem">
                                        <p><strong>A.V.</strong></p>
                                    </div>
                                </div>
                            </div>

                            {dadosFiltrados.map((grupo, idx) => (

                                <div key={idx} className="resultado_dfc">
                                    <div className="header_resultado">
                                        <div className="resultado_titulo">
                                            <p><strong>{grupo.titulo}</strong></p>
                                        </div>
                                        <div className="resultado_total">
                                            <p><strong>{grupo.dados.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
                                        </div>
                                        <div className="resultado_porcentagem">
                                            <p><strong>{((grupo.dados.total / summary.receitas) * 100).toFixed(2)}%</strong></p>
                                        </div>
                                    </div>

                                    {/* Categorias */}
                                    {Object.entries(grupo.dados.categorias)
                                        .sort(([a], [b]) => a.localeCompare(b))
                                        .map(([categoria, dados]) => (
                                            <React.Fragment key={categoria}>
                                                <div key={categoria} className="box_categorias_dre">
                                                    <div className="resultado_titulo">
                                                        <p>{capitalizeFirstLetter(categoria)}</p>
                                                    </div>
                                                    <div className="resultado_total">
                                                        <p>{dados.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                    </div>
                                                    <div className="resultado_porcentagem">
                                                        <p>{((dados.total / summary.receitas) * 100).toFixed(2)}%</p>
                                                    </div>
                                                </div>
                                                {/* Subcategorias */}
                                                {Object.entries(dados.subcategorias)
                                                    .sort(([a], [b]) => a.localeCompare(b))
                                                    .map(([sub, valor]) => (
                                                        <div key={sub} className="box_subcategorias_dre">
                                                            <div className="resultado_titulo">
                                                                <p><PiIcons.PiArrowElbowDownRight className="icone_subcategoria_dre" /> {capitalizeFirstLetter(sub)}</p>
                                                            </div>
                                                            <div className="resultado_total">
                                                                <p>{valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                            </div>
                                                        </div>
                                                    ))}

                                            </React.Fragment>
                                        ))}
                                </div>
                            ))}

                        </div>

                    </div>

                </div>

            </div>

            <InfoResumoBi
                trigger={popUpInfoResumoBi}
                setTrigger={setPopUpInfoResumoBi}
            />

        </div>
    )
}
