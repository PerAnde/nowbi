// src/pages/public/DashboardBi/ResumoBi.jsx
import React, { useState, useEffect } from 'react'
import { Tooltip, BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

import * as PiIcons from 'react-icons/pi'

import { useBiPublic } from '../../../../contexts/BiPublicContext'
import { SelectMesBi } from '../../../../components/Selects/SelectMesBi'
import { SelectAnoBi } from '../../../../components/Selects/SelectAnoBi'
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'

import styles from './ResumoBi.module.scss'

export const ResumoBi = () => {
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

    const [graficoMobile, setGraficoMobile] = useState(window.innerWidth < 800);

    useEffect(() => {
        const handleResize = () => setGraficoMobile(window.innerWidth < 800);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (loading || !dashboardData) return <p>Carregando...</p>

    const { summary, diferencaPercentualReceita } = dashboardData

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

    //Media faturamento
    const bisAtivos = empresa.bis.filter(bi => bi.status)

    const totalReceitas = bisAtivos.reduce((total, bi) => {
        const somaReceitas = bi.lancamentoBi.reduce((acc, lanc) => {
            return lanc.tipo === 'RECEITA' ? acc + parseFloat(lanc.valor) : acc
        }, 0)
        return total + somaReceitas
    }, 0)

    const mediaFaturamento = bisAtivos.length > 0
        ? totalReceitas / bisAtivos.length
        : 0

    // Grafico anual faturamento
    const barData = empresa.bis
        .filter(bi => bi.status)
        .slice(-12)
        .reverse()
        .map(({ mes, ano, lancamentoBi }) => {
            let faturamento = 0
            lancamentoBi.forEach(({ valor, tipo }) => {
                if (tipo === 'RECEITA') faturamento += parseFloat(valor)
            })
            return { mes: capitalizeFirstLetter(`${mes.slice(0, 3)}/${ano.toString().slice(-2)}`), faturamento }
        })

    // Total faturamento 12 meses
    const totalFaturamento12Meses = barData.reduce((acc, item) => acc + item.faturamento, 0)

    return (
        <div className={styles.box_dashboard_bi}>

            <div className={styles.header_pagina_dashboardBi}>
                <h3>Resumo {capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</h3>

                <div className={styles.box_filtro_mes_ano}>
                    <div className={styles.filtros_mes_ano}>
                        <SelectMesBi mesSelecionado={mesSelecionado} setMesSelecionado={setMesSelecionado} mesesDisponiveis={mesesDisponiveis} />
                        <SelectAnoBi anoSelecionado={anoSelecionado} setAnoSelecionado={setAnoSelecionado} anosDisponiveis={anosDisponiveis} />
                    </div>
                </div>
            </div>

            <div className={styles.box_pagina_bi}>

                <div className={styles.box_resumo_mes}>

                    <div className={`${styles.card_resumo_mes} ${styles.card_faturamento_bruto}`}>
                        <div className={styles.infos_resumo_mes}>
                            <p className={styles.titulo_card_mes}>Faturamento Bruto</p>
                            <span>{summary.receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            {diferencaPercentualReceita >= 0 ?
                                <div className={`${styles.infos_mes_anterior} ${styles.positivo}`}>
                                    <i><PiIcons.PiCaretDoubleUpDuotone /></i>
                                    <p className={styles.info_positivo}><span>+{Math.abs(diferencaPercentualReceita).toFixed(2)}%</span> em relação ao mês anterior</p>
                                </div>
                                :
                                <div className={`${styles.infos_mes_anterior} ${styles.negativo}`}>
                                    <i><PiIcons.PiCaretDoubleDownDuotone /></i>
                                    <p className={styles.info_positivo}><span>-{Math.abs(diferencaPercentualReceita).toFixed(2)}%</span> em relação ao mês anterior</p>
                                </div>
                            }
                        </div>
                        <span className={`${styles.icone_card_mes} ${styles.icone_faturamento_bruto}`}><PiIcons.PiCoins /></span>
                    </div>

                    <div className={`${styles.card_resumo_mes} ${styles.card_resultado_liquido}`}>
                        <div className={styles.infos_resumo_mes}>
                            <p className={styles.titulo_card_mes}>Receita Operacional Líquida</p>
                            <span>{receitaOperacionalLiquida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            <div className={styles.infos_card_mes}>
                                {/* <p><i><PiIcons.PiInfo /></i> Mais informações</p> */}
                            </div>
                        </div>
                        <span className={`${styles.icone_card_mes} ${styles.icone_resultado_liquido}`}><PiIcons.PiReceipt /></span>
                    </div>

                    <div className={`${styles.card_resumo_mes} ${styles.card_lucro_bruto}`}>
                        <div className={styles.infos_resumo_mes}>
                            <p className={styles.titulo_card_mes}>Resultado Bruto</p>
                            <span>{resultadoBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            <div className={styles.infos_card_mes}>
                                {/* <p><i><PiIcons.PiInfo /></i> Mais informações</p> */}
                            </div>
                        </div>
                        <span className={`${styles.icone_card_mes} ${styles.icone_lucro_bruto}`}><PiIcons.PiTrendUp /></span>
                    </div>

                    <div className={`${styles.card_resumo_mes} ${styles.card_saldo_final}`}>
                        <div className={styles.infos_resumo_mes}>
                            <p className={styles.titulo_card_mes}>Saldo de Caixa</p>
                            <span>{saldoDeCaixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            <div className={styles.infos_card_mes}>
                                {/* <p><i><PiIcons.PiInfo /></i> Mais informações</p> */}
                            </div>
                        </div>
                        <span className={`${styles.icone_card_mes} ${styles.icone_saldo_final}`}><PiIcons.PiBank /></span>
                    </div>

                </div>

                <div className={styles.box_metricas_mes}>

                    <div className={styles.card_metrica_mes}>
                        <div className={styles.infos_metricas_mes}>
                            <p className={styles.titulo_card_mes}>Margem de contribuição</p>
                            <h3>{margemDeContribuicao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <span>({margemDeContribuicaoPercentual}%)</span></h3>
                        </div>
                        {/* <div className={styles.box_btn_mais_infos}>
                            <PiIcons.PiInfo /> Mais informações
                        </div> */}
                    </div>

                    <div className={styles.card_metrica_mes}>
                        <div className={styles.infos_metricas_mes}>
                            <p className={styles.titulo_card_mes}>Ponto de Equilíbrio Operacional</p>
                            <h3>{pontoDeEquilibrioOperacional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        </div>
                        {/* <div className={styles.box_btn_mais_infos}>
                            <PiIcons.PiInfo /> Mais informações
                        </div> */}
                    </div>

                    <div className={styles.card_metrica_mes}>
                        <div className={styles.infos_metricas_mes}>
                            <p className={styles.titulo_card_mes}>Ponto de Equilíbrio Financeiro</p>
                            <h3>{pontoDeEquilibrioFinanceiro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        </div>
                        {/* <div className={styles.box_btn_mais_infos}>
                            <PiIcons.PiInfo /> Mais informações
                        </div> */}
                    </div>

                    <div className={styles.card_metrica_mes}>
                        <div className={styles.infos_metricas_mes}>
                            <p className={styles.titulo_card_mes}>Média de Faturamento</p>
                            <h3>{mediaFaturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        </div>
                        {/* <div className={styles.box_btn_mais_infos}>
                            <PiIcons.PiInfo /> Mais informações
                        </div> */}
                    </div>

                </div>

                <div className={styles.box_historico_faturamento}>
                    {/* Histórico de Faturamento Bruto */}
                    <div className={styles.header_historico_faturamento}>
                        <p>Histórico de Faturamento Bruto <span>(Últimos 12 meses)</span></p>
                        <h3>{totalFaturamento12Meses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>

                        <div className={styles.header_descricao}>
                            <span></span>
                            <p>Faturamento</p>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={barData}
                            margin={{ top: 0, right: 0, left: 0, bottom: 20 }}
                            barCategoryGap="5%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-input)" />
                            <XAxis dataKey="mes"
                                stroke="var(--border-input)"
                                tick={{
                                    fill: 'var(--texto-secundario)',
                                    fontSize: 14,
                                }}
                                angle={graficoMobile ? -80 : 0}
                                textAnchor={graficoMobile ? "end" : "middle"}
                                dy={graficoMobile ? 5 : 0}
                                style={
                                    { fontSize: graficoMobile ? 12 : 16 }
                                }
                            />
                            <Tooltip
                                formatter={(value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                contentStyle={{ background: "var(--branco)", color: "var(--texto-primario)", borderRadius: "var(--border-radius-componente)", border: '1px solid var(--texto-secundario)' }} />
                            <Bar dataKey="faturamento" fill="#008aee" name="Faturamento" radius={[10, 10, 10, 10]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    )
}
