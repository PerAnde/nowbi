// src/pages/public/DashboardBi/ResumoBi.jsx
import React, { useState, useEffect } from 'react'
import { Tooltip, BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

import * as PiIcons from 'react-icons/pi'

import { useBiPublic } from '../../../../contexts/BiPublicContext'
import { SelectMesBi } from '../../../../components/Selects/SelectMesBi'
import { SelectAnoBi } from '../../../../components/Selects/SelectAnoBi'
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'
import { salvarDRE } from '../../../../utils/salvarPDF'

import styles from './DfcBi.module.scss'
import './dre.css'

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

    if (loading || !dashboardData) return <p>Carregando...</p>

    const { summary, diferencaPercentualReceita } = dashboardData

    // Filtro grupos de DRE
    const gruposDeDRE = [
        { titulo: 'Receita Operacional Bruta (+)', grupo: 'RECEITA_OPERACIONAL_BRUTA' },
        { titulo: 'Deduções e Impostos (-)', grupo: 'DEDUCOES_DA_RECEITA_BRUTA' },
        { titulo: 'Receita Financeira', grupo: 'RECEITA_FINANCEIRA' },
        { titulo: 'Custo Variável (CPV ou CMV)', grupo: 'CUSTO_VARIAVEL' },
        { titulo: 'Despesas Operacionais', grupo: 'DESPESAS_OPERACIONAIS' },
        { titulo: 'Despesas Variáveis', grupo: 'DESPESAS_VARIAVEIS' },
        { titulo: 'Despesas Financeiras', grupo: 'DESPESAS_FINANCEIRAS' },
        { titulo: 'Outras Despesas', grupo: 'OUTRAS_DESPESAS' },
        { titulo: 'Saldo de Caixa (+/-)', grupo: 'SALDO_DE_CAIXA' },
    ];

    // Função para filtrar e organizar os dados
    const agruparPorGrupo = (dados) => {
        return dados.reduce((acc, item) => {
            if (!acc[item.grupoDre]) {
                acc[item.grupoDre] = { total: 0, categorias: {} };
            }

            acc[item.grupoDre].total += item.valor;

            if (item.categoria) {
                if (!acc[item.grupoDre].categorias[item.categoria]) {
                    acc[item.grupoDre].categorias[item.categoria] = { total: 0, subcategorias: {} };
                }

                acc[item.grupoDre].categorias[item.categoria].total += item.valor;

                if (item.subcategoria) {
                    if (!acc[item.grupoDre].categorias[item.categoria].subcategorias[item.subcategoria]) {
                        acc[item.grupoDre].categorias[item.categoria].subcategorias[item.subcategoria] = 0;
                    }
                    acc[item.grupoDre].categorias[item.categoria].subcategorias[item.subcategoria] += item.valor;
                }
            }

            return acc;
        }, {});
    };

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

    const dadosFiltrados = agruparDados(dashboardData.summary.detalhes);

    return (
        <div className={styles.box_dashboard_bi}>

            <div className={styles.header_pagina_dashboardBi}>
                <h3>DFC {capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</h3>

                <div className={styles.box_filtro_mes_ano}>
                    <div className={styles.filtros_mes_ano}>
                        <SelectMesBi mesSelecionado={mesSelecionado} setMesSelecionado={setMesSelecionado} mesesDisponiveis={mesesDisponiveis} />
                        <SelectAnoBi anoSelecionado={anoSelecionado} setAnoSelecionado={setAnoSelecionado} anosDisponiveis={anosDisponiveis} />
                    </div>
                </div>
            </div>

            <div className={styles.box_pagina_bi}>

                <div className="dreContainer">

                    <div className="box_topo_dre">
                        <div className="box_btns_salvar">
                            {/* <button onClick={() => exportarParaExcel(receitasAgrupadas, despesasAgrupadas, summary, custos, despesasOrdenadas, lucroBruto)}>Exportar .XLS</button> */}
                            <button onClick={salvarDRE}>Salvar PDF</button>
                        </div>
                    </div>

                    <div className="wrapper_dre">

                        <div className="box_resultados_dre">

                            <div className="box_header_dre">
                                <div className="header_dados_dre">
                                    <p><strong>Descrição</strong></p>
                                    <p><strong>Total</strong></p>
                                    <p><strong>A.V.</strong></p>
                                </div>
                            </div>

                            {dadosFiltrados.map((grupo, idx) => (

                                <div key={idx} className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <p><strong>{grupo.titulo}</strong></p>
                                        <p><strong>{grupo.dados.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
                                        <p><strong>{((grupo.dados.total / summary.receitas) * 100).toFixed(2)}%</strong></p>
                                    </div>

                                    {/* Categorias */}
                                    {Object.entries(grupo.dados.categorias)
                                        .sort(([a], [b]) => a.localeCompare(b))
                                        .map(([categoria, dados]) => (
                                            <React.Fragment key={categoria}>
                                                <div key={categoria} className="box_categorias_dre">
                                                    <p>{capitalizeFirstLetter(categoria)}</p>
                                                    <p>{dados.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                                    <p>{((dados.total / summary.receitas) * 100).toFixed(2)}%</p>
                                                </div>
                                                {/* Subcategorias */}
                                                {Object.entries(dados.subcategorias).map(([sub, valor]) => (
                                                    <div key={sub} className="box_subcategorias_dre">
                                                        <p><PiIcons.PiArrowElbowDownRight className="icone_subcategoria_dre" /> {capitalizeFirstLetter(sub)}</p>
                                                        <p>{valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
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
