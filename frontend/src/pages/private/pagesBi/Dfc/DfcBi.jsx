// src/pages/public/DashboardBi/ResumoBi.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import * as PiIcons from 'react-icons/pi'

import { useBiPublic } from '../../../../contexts/BiPublicContext'
import { SelectMesBi } from '../../../../components/Selects/SelectMesBi'
import { SelectAnoBi } from '../../../../components/Selects/SelectAnoBi'
import { agruparPorGrupo } from '../../../../utils/agruparPorGrupo'
import { gruposDeDRE } from '../../../../utils/gruposDeDRE'
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'
import { salvarDFC } from '../../../../utils/salvarPDF'

import { api } from '../../../../api/api'
import empresaSemLogo from '../../../../assets/images/imgEmpresaSemLogo.jpg'

import styles from './DfcBi.module.scss'
import './dfc.css'

export const DfcBi = () => {
    const {
        empresa,
        dashboardData,
        mesSelecionado,
        anoSelecionado,
        setMesSelecionado,
        setAnoSelecionado,
        mesesDisponiveis,
        anosDisponiveis,
        loading
    } = useBiPublic()

    if (!empresa) return null

    const monthOrder = {
        "janeiro": { num: 1, abbr: "Jan" }, "fevereiro": { num: 2, abbr: "Fev" }, "março": { num: 3, abbr: "Mar" },
        "abril": { num: 4, abbr: "Abr" }, "maio": { num: 5, abbr: "Mai" }, "junho": { num: 6, abbr: "Jun" },
        "julho": { num: 7, abbr: "Jul" }, "agosto": { num: 8, abbr: "Ago" }, "setembro": { num: 9, abbr: "Set" },
        "outubro": { num: 10, abbr: "Out" }, "novembro": { num: 11, abbr: "Nov" }, "dezembro": { num: 12, abbr: "Dez" }
    };

    const [ultimos12Meses, setUltimos12Meses] = useState(false);

    useEffect(() => {
        if (!empresa || !mesSelecionado || !anoSelecionado) return;

        const biExiste = empresa.bis.some(bi =>
            bi.status &&
            bi.mes.toLowerCase() === mesSelecionado.toLowerCase() &&
            Number(bi.ano) === Number(anoSelecionado)
        );

        if (!biExiste) {
            alert(`Não há BI lançado para ${capitalizeFirstLetter(mesSelecionado)}/${anoSelecionado}.`);
            if (empresa.bis.length > 0) {
                const ultimoBi = empresa.bis
                    .filter(bi => bi.status)
                    .sort((a, b) =>
                        b.ano - a.ano ||
                        monthOrder[b.mes.toLowerCase()].num - monthOrder[a.mes.toLowerCase()].num
                    )[0];

                setMesSelecionado(ultimoBi.mes);
                setAnoSelecionado(ultimoBi.ano);
                window.location.reload();
            }
        }
    }, [empresa, mesSelecionado, anoSelecionado]);

    if (loading || !dashboardData) return <p>Carregando...</p>

    const { summary } = dashboardData

    // Filtra e organiza os dados
    const agruparDados = (dados) => {
        const dadosAgrupados = agruparPorGrupo(dados);
        const resultado = [];

        const getTotal = (grupo) => dadosAgrupados[grupo]?.total || 0;

        gruposDeDRE.forEach((grupo, index) => {
            const grupoDados = dadosAgrupados[grupo.grupo];
            if (grupoDados) {
                resultado.push({
                    ...grupo,
                    dados: grupoDados
                });
            }

            // Depois de DEDUCOES_DA_RECEITA_BRUTA, inserir Receita Operacional Líquida
            if (grupo.grupo === 'DEDUCOES_DA_RECEITA_BRUTA') {
                const receitaBruta = getTotal('RECEITA_OPERACIONAL_BRUTA');
                const deducoes = getTotal('DEDUCOES_DA_RECEITA_BRUTA');

                resultado.push({
                    titulo: 'Receita Operacional Líquida (=)',
                    grupo: 'RESULTADO_RECEITA_LIQUIDA',
                    dados: {
                        total: receitaBruta - deducoes,
                        categorias: {}
                    },
                    isResultado: true
                });
            }

            // Depois de CUSTO_VARIAVEL, inserir Receita Bruto
            if (grupo.grupo === 'CUSTO_VARIAVEL') {
                const receitaBruta = getTotal('RECEITA_OPERACIONAL_BRUTA');
                const deducoes = getTotal('DEDUCOES_DA_RECEITA_BRUTA');
                const custoVariavel = getTotal('CUSTO_VARIAVEL');
                const receitaLiquida = receitaBruta - deducoes;

                resultado.push({
                    titulo: 'Resultado Bruto',
                    grupo: 'RESULTADO_BRUTO',
                    dados: {
                        total: receitaLiquida - custoVariavel,
                        categorias: {}
                    },
                    isResultado: true
                });
            }

            // Após OUTRAS_DESPESAS, inserir LUCRO/PREJUIZO OPERACIONAL
            if (grupo.grupo === 'OUTRAS_DESPESAS') {
                const receitaBruta = getTotal('RECEITA_OPERACIONAL_BRUTA');
                const deducoes = getTotal('DEDUCOES_DA_RECEITA_BRUTA');
                const custoVariavel = getTotal('CUSTO_VARIAVEL');
                const despesasOperacionais = getTotal('DESPESAS_OPERACIONAIS');
                const despesasVariaveis = getTotal('DESPESAS_VARIAVEIS');
                const despesasFinanceiras = getTotal('DESPESAS_FINANCEIRAS');
                const outrasDespesas = getTotal('OUTRAS_DESPESAS');
                const outrasReceitas = dadosAgrupados['OUTRAS_RECEITAS'];
                const totalOutrasReceitas = outrasReceitas?.total || 0;
                const irCsll = dadosAgrupados['IR_CSLL'];
                const totalIrCsll = getTotal('IR_CSLL');

                // Cálculo do lucro operacional
                const receitaLiquida = receitaBruta - deducoes;
                const lucroBruto = receitaLiquida - custoVariavel;
                const totalLucroPrejuizoOperacional = lucroBruto - despesasOperacionais - despesasVariaveis - despesasFinanceiras - outrasDespesas;

                resultado.push({
                    titulo: 'Saldo de Caixa Operacional',
                    grupo: 'SALDO_DE_CAIXA_OPERACIONAL',
                    dados: {
                        total: totalLucroPrejuizoOperacional,
                        categorias: {}
                    },
                    isResultado: true
                });

                if (outrasReceitas) {
                    resultado.push({
                        titulo: 'Outras Receitas',
                        grupo: 'OUTRAS_RECEITAS',
                        dados: outrasReceitas
                    });
                }

                // Lucro Líquido Antes do IR = Operacional + Outras Receitas
                const lucroAntesIR = totalLucroPrejuizoOperacional + totalOutrasReceitas;

                // resultado.push({
                //     titulo: 'Lucro Líquido Antes IR',
                //     grupo: 'LUCRO_LIQUIDO_ANTES_IR',
                //     dados: {
                //         total: lucroAntesIR,
                //         categorias: {}
                //     },
                //     isResultado: true
                // });

                if (irCsll) {
                    resultado.push({
                        titulo: 'IR e CSLL',
                        grupo: 'IR_CSLL',
                        dados: irCsll,
                        isResultado: false
                    });
                }

                // Lucro/Prejuízo Acumulado = Lucro Antes IR - IR e CSLL
                resultado.push({
                    titulo: 'Saldo de Caixa (+/-)',
                    grupo: 'SALDO_DE_CAIXA',
                    dados: {
                        total: lucroAntesIR - totalIrCsll,
                        categorias: {}
                    },
                    isResultado: true
                });
            }

        });

        return resultado;
    };

    // Dados para gerar calculos
    const dadosAgrupados = agruparPorGrupo(dashboardData.summary.detalhes);
    const getTotal = (grupo) => dadosAgrupados[grupo]?.total || 0;

    const receitaBruta = getTotal('RECEITA_OPERACIONAL_BRUTA');
    const deducoesImpostos = getTotal('DEDUCOES_DA_RECEITA_BRUTA');
    const custoVariavel = getTotal('CUSTO_VARIAVEL');
    const despesasVariaveis = getTotal('DESPESAS_VARIAVEIS');
    const despesasOperacionais = getTotal('DESPESAS_OPERACIONAIS');
    const despesasFinanceiras = getTotal('DESPESAS_FINANCEIRAS');
    const outrasDespesas = getTotal('OUTRAS_DESPESAS');
    const outrasReceitas = getTotal('OUTRAS_RECEITAS');

    const receitaOperacionalLiquida = receitaBruta - deducoesImpostos

    // Calculo margem de contribuicao
    const resultadoBruto = receitaBruta - deducoesImpostos - custoVariavel
    const margemDeContribuicao = resultadoBruto - despesasVariaveis;
    const margemDeContribuicaoDecimal = receitaBruta > 0 ? (margemDeContribuicao / receitaBruta) : 0;
    const margemDeContribuicaoPercentual = (margemDeContribuicaoDecimal * 100).toFixed(2);
    const margemDeContribuicaoArredondadaDecimal = Number(margemDeContribuicaoPercentual) / 100;

    // const saldoFinal = resultadoBruto - despesasOperacionais - despesasVariaveis - despesasFinanceiras - outrasDespesas;
    const receitaLiquida = receitaBruta - deducoesImpostos;
    const lucroBruto = receitaLiquida - custoVariavel;
    const saldoDeCaixaOperacional = lucroBruto - despesasOperacionais - despesasVariaveis - despesasFinanceiras - outrasDespesas;
    const saldoDeCaixa = saldoDeCaixaOperacional + outrasReceitas

    // Calculo ponto de equilibrio operacional
    const pontoDeEquilibrioOperacional = margemDeContribuicaoDecimal > 0
        ? (despesasOperacionais / margemDeContribuicaoArredondadaDecimal)
        : 0;

    // Calceulo ponto de equilibrio financeiro
    const somaDepesasOperacionaisEFinanceiras = despesasOperacionais + despesasFinanceiras;
    const pontoDeEquilibrioFinanceiro = somaDepesasOperacionaisEFinanceiras / margemDeContribuicaoArredondadaDecimal;

    const dadosFiltrados = agruparDados(dashboardData.summary.detalhes);

    return (
        <div className={styles.box_dashboard_bi}>

            <div className={styles.header_pagina_dashboardBi}>
                <h3>DFC {capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</h3>

                <div className={styles.box_filtro_mes_ano}>
                    <div className={styles.mes_ano}>
                        <SelectMesBi mesSelecionado={mesSelecionado} setMesSelecionado={setMesSelecionado} mesesDisponiveis={mesesDisponiveis} />
                        <SelectAnoBi anoSelecionado={anoSelecionado} setAnoSelecionado={setAnoSelecionado} anosDisponiveis={anosDisponiveis} />
                    </div>
                    {/* {ultimos12Meses ?
                        <div className={`${styles.btn_ultimos_12_meses} ${styles.btn_ultimos_12_meses_ativo}`} onClick={() => setUltimos12Meses(prev => !prev)}>
                            <span>Últimos</span>
                            <p>12 Meses</p>
                        </div>
                        :
                        <div className={styles.btn_ultimos_12_meses} onClick={() => setUltimos12Meses(prev => !prev)}>
                            <span>Últimos</span>
                            <p>12 Meses</p>
                        </div>
                    } */}
                </div>
            </div>

            <div className={styles.box_pagina_bi}>

                <div className={styles.box_metricas_mes}>

                    <div className={styles.card_metrica_mes}>
                        <div className={styles.infos_metricas_mes}>
                            <p className={styles.titulo_card_mes}>Margem de contribuição</p>
                            <h3>{margemDeContribuicao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <span>({margemDeContribuicaoPercentual}%)</span></h3>
                        </div>
                    </div>

                    <div className={styles.card_metrica_mes}>
                        <div className={styles.infos_metricas_mes}>
                            <p className={styles.titulo_card_mes}>Ponto de Equilíbrio Operacional</p>
                            <h3>{pontoDeEquilibrioOperacional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        </div>
                    </div>

                    <div className={styles.card_metrica_mes}>
                        <div className={styles.infos_metricas_mes}>
                            <p className={styles.titulo_card_mes}>Ponto de Equilíbrio Financeiro</p>
                            <h3>{pontoDeEquilibrioFinanceiro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        </div>
                    </div>

                </div>

                <div className={styles.box_topo_dre}>
                    <div className={styles.box_btns_salvar}>
                        <button onClick={salvarDFC}>Gerar DFC</button>
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

        </div>
    )
}
