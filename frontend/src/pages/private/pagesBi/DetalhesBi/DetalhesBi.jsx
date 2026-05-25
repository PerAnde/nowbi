import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { AreaChart, BarChart, Bar, CartesianGrid, XAxis, Tooltip, Area, Cell, Sector, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { useBiPublic } from '../../../../contexts/BiPublicContext'

import { FiltroDashboardBi } from '../../../../components/Selects/FiltroDashboardBi'
import { InfosDetalhesBi } from '../../../../components/Modal/InfosDetalhesBi/InfosDetalhesBi'

import { agruparPorGrupo } from '../../../../utils/agruparPorGrupo'
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'
import { CoresGraficos } from '../../../../utils/coresGraficos';
import { frasesPorGrupo } from '../../../../utils/frasesPorGrupo'
import { gruposDeDFC } from '../../../../utils/gruposDeDFC'
import { organizaMeses } from '../../../../utils/organizaMeses'

import stylesMainBi from '../mainBi.module.scss'
import styles from './DetalhesBi.module.scss'
import * as PiIcons from 'react-icons/pi'

export const DetalhesBi = () => {

    const {
        empresa,
        dashboardData,
        mesSelecionado,
        anoSelecionado,
        setMesSelecionado,
        setAnoSelecionado,
        anosDisponiveis,
        loading
    } = useBiPublic()

    const [activeIndex, setActiveIndex] = useState(0);
    const [ordemDecrescenteReceitas, setOrdemDecrescenteReceitas] = useState(true);
    const [ordemDecrescenteDespesas, setOrdemDecrescenteDespesas] = useState(true);
    const [graficoMobile, setGraficoMobile] = useState(window.innerWidth < 800);

    const [dadosParaPopup, setDadosParaPopup] = useState(null);
    const [fraseCardSelecionado, setFraseCardSelecionado] = useState('');

    const [categoriaReceitaSelecionada, setCategoriaReceitaSelecionada] = useState(null);
    const [categoriaDespesaSelecionada, setCategoriaDespesaSelecionada] = useState(null);

    const [popUpInfosDetalhesBi, setPopUpInfosDetalhesBi] = useState(false)

    useEffect(() => {
        const handleResize = () => setGraficoMobile(window.innerWidth < 800);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const receitasSubcategorias = {};
    const despesasSubcategorias = {};

    if (dashboardData?.summary?.detalhes) {
        dashboardData.summary.detalhes.forEach(({ tipo, subcategoria, valor }) => {
            if (!subcategoria) return;
            const nome = typeof subcategoria === 'string' ? subcategoria : subcategoria?.nome;
            if (tipo === 'RECEITA') {
                receitasSubcategorias[nome] = (receitasSubcategorias[nome] || 0) + valor;
            } else if (tipo === 'DESPESA') {
                despesasSubcategorias[nome] = (despesasSubcategorias[nome] || 0) + valor;
            }
        });
    }

    const pieDataReceitas = Object.entries(receitasSubcategorias)
        .map(([name, value], index) => ({
            name,
            value,
            color: CoresGraficos[index % CoresGraficos.length]
        }))
        .sort((a, b) => ordemDecrescenteReceitas ? b.value - a.value : a.value - b.value);

    const pieDataDespesas = Object.entries(despesasSubcategorias)
        .map(([name, value], index) => ({
            name,
            value,
            color: CoresGraficos[index % CoresGraficos.length]
        }))
        .sort((a, b) => ordemDecrescenteDespesas ? b.value - a.value : a.value - b.value);

    useEffect(() => {
        if (!loading && dashboardData) {
            if (pieDataReceitas.length > 0 && !categoriaReceitaSelecionada) {
                setCategoriaReceitaSelecionada(pieDataReceitas[0].name);
            }
            if (pieDataDespesas.length > 0 && !categoriaDespesaSelecionada) {
                setCategoriaDespesaSelecionada(pieDataDespesas[0].name);
            }
        }
    }, [pieDataReceitas, pieDataDespesas, loading, dashboardData]);

    if (loading || !dashboardData) return <p>Carregando...</p>

    const gerarEvolucao = (categoriaSelecionada, tipoFiltro) => {
        if (!categoriaSelecionada || !empresa?.bis) return [];
        return empresa.bis
            .filter(bi => bi.status)
            .sort((a, b) => a.ano - b.ano || organizaMeses[a.mes.toLowerCase()].num - organizaMeses[b.mes.toLowerCase()].num)
            .slice(-12)
            .map(({ mes, ano, lancamentoBi }) => {
                let total = 0;
                lancamentoBi.forEach(({ valor, tipo, subcategoria }) => {
                    const nomeSub = typeof subcategoria === 'string' ? subcategoria : subcategoria?.name;
                    if (tipo?.toUpperCase() === tipoFiltro && nomeSub?.trim().toLowerCase() === categoriaSelecionada.trim().toLowerCase()) {
                        total += Number(valor);
                    }
                });
                return {
                    mes: `${organizaMeses[mes.toLowerCase()].abbr}/${ano.toString().slice(-2)}`,
                    valor: total
                };
            });
    };

    const evolucaoReceita = gerarEvolucao(categoriaReceitaSelecionada, 'RECEITA');
    const evolucaoDespesa = gerarEvolucao(categoriaDespesaSelecionada, 'DESPESA');

    const corEvolucaoReceita = pieDataReceitas.find(item => item.name === categoriaReceitaSelecionada)?.color || 'var(--cor-primaria)';
    const corEvolucaoDespesa = pieDataDespesas.find(item => item.name === categoriaDespesaSelecionada)?.color || 'var(--cor-primaria)';

    const aplicarFiltro = (novoMes, novoAno) => {
        setMesSelecionado(novoMes);
        setAnoSelecionado(novoAno);
    };

    const { summary, diferencaPercentualReceita, diferencaPercentualDespesa } = dashboardData

    summary.detalhes.forEach(({ tipo, subcategoria, valor }) => {
        if (!subcategoria) return;

        if (tipo === 'RECEITA') {
            const nome = typeof subcategoria === 'string'
                ? subcategoria
                : subcategoria?.nome;

            receitasSubcategorias[nome] =
                (receitasSubcategorias[nome] || 0) + valor;
        }

        if (tipo === 'DESPESA') {
            const nome = typeof subcategoria === 'string'
                ? subcategoria
                : subcategoria?.nome;

            despesasSubcategorias[nome] =
                (despesasSubcategorias[nome] || 0) + valor;
        }
    });

    const dadosAgrupados = agruparPorGrupo(dashboardData.summary.detalhes);
    const getTotal = (grupo) => dadosAgrupados[grupo]?.total || 0;

    const receitaBruta = getTotal('RECEITA_OPERACIONAL_BRUTA');
    const deducoesImpostos = getTotal('DEDUCOES_DA_RECEITA_BRUTA');
    const custoVariavel = getTotal('CUSTO_VARIAVEL');
    const despesasOperacionais = getTotal('DESPESAS_OPERACIONAIS');
    const despesasVariaveis = getTotal('DESPESAS_VARIAVEIS');
    const despesasFinanceiras = getTotal('DESPESAS_FINANCEIRAS');
    const outrasDespesas = getTotal('OUTRAS_DESPESAS');
    const outrasReceitas = getTotal('OUTRAS_RECEITAS');

    const receitaLiquida = receitaBruta - deducoesImpostos;
    const lucroBruto = receitaLiquida - custoVariavel;
    const saldoDeCaixaOperacional = lucroBruto - despesasOperacionais - despesasVariaveis - despesasFinanceiras - outrasDespesas;
    const saldoDeCaixa = saldoDeCaixaOperacional + outrasReceitas

    const dataPizza = [
        { name: 'Receitas', value: summary.receitas },
        { name: 'Despesas', value: summary.despesas },
    ];

    const agruparDados = (dados) => {
        const dadosAgrupados = agruparPorGrupo(dados);
        const resultado = [];

        gruposDeDFC.forEach((grupo, index) => {
            const grupoDados = dadosAgrupados[grupo.grupo];
            if (grupoDados) {
                resultado.push({
                    ...grupo,
                    dados: grupoDados
                });
            }
        });

        return resultado;
    }

    const dadosFiltrados = agruparDados(dashboardData.summary.detalhes);

    const onPieEnter = (_, index) => setActiveIndex(index);

    const renderActiveShape = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value,
    }) => {
        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * (midAngle ?? 1));
        const cos = Math.cos(-RADIAN * (midAngle ?? 1));
        const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
        const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
        const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
        const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        const words = capitalizeFirstLetter(payload.name).split(' ');

        const firstLine = words.slice(0, 2).join(' ');
        const secondLine = words.slice(2, 4).join(' ');
        const thirdLine = words.slice(4).join(' ');

        const isSingleLine = !secondLine && !thirdLine;
        const isTwoLines = !!secondLine && !thirdLine;

        return (
            <g>
                {isSingleLine ? (
                    <text x={cx} y={cy} textAnchor="middle" fill="var(--texto-secundario)">
                        {firstLine}
                    </text>
                ) : isTwoLines ? (
                    <>
                        <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--texto-secundario)">
                            {firstLine}
                        </text>
                        <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--texto-secundario)">
                            {secondLine}
                        </text>
                    </>
                ) : (
                    <>
                        <text x={cx} y={cy - 10} textAnchor="middle" fill="var(--texto-secundario)">
                            {firstLine}
                        </text>
                        <text x={cx} y={cy + 6} textAnchor="middle" fill="var(--texto-secundario)">
                            {secondLine}
                        </text>
                        <text x={cx} y={cy + 24} textAnchor="middle" fill="var(--texto-secundario)">
                            {thirdLine}
                        </text>
                    </>
                )}

                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={(outerRadius ?? 0) + 7}
                    outerRadius={(outerRadius ?? 0) + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="var(--texto-secundario)">
                    {`R$ ${value?.toLocaleString('pt-BR')}`}
                </text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${((percent ?? 0) * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    const dataAnual = empresa.bis
        .filter(bi => bi.status)
        .sort((a, b) =>
            a.ano - b.ano ||
            organizaMeses[a.mes.toLowerCase()].num -
            organizaMeses[b.mes.toLowerCase()].num
        )
        .slice(-12)
        .map(({ mes, ano, lancamentoBi }) => {
            let receitas = 0;
            let despesas = 0;

            lancamentoBi.forEach(({ valor, tipo }) => {
                const valorNum = parseFloat(valor);
                if (tipo === 'RECEITA') receitas += valorNum;
                if (tipo === 'DESPESA') despesas += valorNum;
            });

            return {
                mes: `${organizaMeses[mes.toLowerCase()].abbr}/${ano.toString().slice(-2)}`,
                receitas,
                despesas
            };
        });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    style={{
                        background: 'var(--branco)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--border-radius-componente)',
                        padding: '10px',
                    }}
                >
                    <p style={{ color: 'var(--texto-secundario)', marginBottom: '6px' }}>{label}</p>

                    {payload.map((entry, i) => (
                        <p
                            key={i}
                            style={{
                                color: entry.name === 'Despesas' ? 'var(--vermelho)' : 'var(--verde)',
                                margin: 0,
                            }}
                        >
                            {entry.name}: {entry.value.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </p>
                    ))}
                </div>
            );
        }

        return null;
    };

    const toggleOrdemReceitas = () => {
        setOrdemDecrescenteReceitas((prev) => !prev);
    };
    const toggleOrdemDespesas = () => {
        setOrdemDecrescenteDespesas((prev) => !prev);
    };

    return (
        <div className={styles.box_dashboard_bi}>

            <div className={stylesMainBi.header_pagina_dashboardBi}>
                <h3>Detalhes {capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</h3>

                <div>
                    <div className={stylesMainBi.filtros_mes_ano}>
                        <FiltroDashboardBi
                            empresa={empresa}
                            mesAtivo={mesSelecionado}
                            anoAtivo={anoSelecionado}
                            anosDisponiveis={anosDisponiveis}
                            onAplicar={aplicarFiltro}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.box_pagina_bi}>

                <div className={styles.box_resumo_detalhes_mes}>

                    <div className={`${styles.card_resumo_detalhes_mes} ${styles.card_receitas}`}>
                        <div className={styles.box_infos_detalhes_mes}>
                            <div className={styles.header_infos_card}>
                                <p className={styles.titulo_card_mes}>Receitas</p>
                                <span>{summary.receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                {diferencaPercentualReceita >= 0 ?
                                    <div className={`${styles.infos_mes_anterior} ${styles.positivo}`}>
                                        <i><PiIcons.PiCaretDoubleUpDuotone /></i>
                                        <p className={styles.info_positivo}><span>+{Math.abs(diferencaPercentualReceita).toFixed(2)}%</span> vs. mês anterior</p>
                                    </div>
                                    :
                                    <div className={`${styles.infos_mes_anterior} ${styles.negativo}`}>
                                        <i><PiIcons.PiCaretDoubleDownDuotone /></i>
                                        <p className={styles.info_positivo}><span>-{Math.abs(diferencaPercentualReceita).toFixed(2)}%</span> vs. mês anterior</p>
                                    </div>
                                }
                            </div>
                            <span className={`${styles.icone_card_mes} ${styles.icone_receitas}`}><PiIcons.PiArrowUpRight /></span>
                        </div>

                        <div className={styles.grafico_card}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={dataAnual}
                                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                                >

                                    <defs>
                                        <linearGradient id="gradienteReceitas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--verde)" stopOpacity={0.35} />
                                            <stop offset="100%" stopColor="var(--verde)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <XAxis dataKey="mes" hide />

                                    <Tooltip
                                        formatter={(value) =>
                                            value.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })
                                        }
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="receitas"
                                        name="Receitas"
                                        stroke="var(--verde)"
                                        fill="url(#gradienteReceitas)"
                                        strokeWidth={1}
                                        dot={{
                                            r: 5,
                                            fill: "#fff",
                                            stroke: "var(--verde)",
                                            strokeWidth: 1
                                        }}
                                        activeDot={{
                                            r: 6
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={`${styles.card_resumo_detalhes_mes} ${styles.card_despesas}`}>
                        <div className={styles.box_infos_detalhes_mes}>
                            <div className={styles.header_infos_card}>
                                <p className={styles.titulo_card_mes}>Despesas</p>
                                <span>{summary.despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                {diferencaPercentualDespesa >= 0 ?
                                    <div className={`${styles.infos_mes_anterior} ${styles.negativo}`}>
                                        <i><PiIcons.PiCaretDoubleUpDuotone /></i>
                                        <p className={styles.info_positivo}><span>+{Math.abs(diferencaPercentualDespesa).toFixed(2)}%</span> vs. mês anterior</p>
                                    </div>
                                    :
                                    <div className={`${styles.infos_mes_anterior} ${styles.positivo}`}>
                                        <i><PiIcons.PiCaretDoubleDownDuotone /></i>
                                        <p className={styles.info_positivo}><span>-{Math.abs(diferencaPercentualDespesa).toFixed(2)}%</span> vs. mês anterior</p>
                                    </div>
                                }
                            </div>
                            <span className={`${styles.icone_card_mes} ${styles.icone_despesas}`}><PiIcons.PiArrowDownRight /></span>
                        </div>

                        <div className={styles.grafico_card}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={dataAnual}
                                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                                >

                                    <defs>
                                        <linearGradient id="gradienteDespesas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--vermelho)" stopOpacity={0.35} />
                                            <stop offset="100%" stopColor="var(--vermelho)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <XAxis dataKey="mes" hide />

                                    <Tooltip
                                        formatter={(value) =>
                                            value.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })
                                        }
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="despesas"
                                        name="Despesas"
                                        stroke="var(--vermelho)"
                                        fill="url(#gradienteDespesas)"
                                        strokeWidth={1}
                                        dot={{
                                            r: 5,
                                            fill: "#fff",
                                            stroke: "var(--vermelho)",
                                            strokeWidth: 1
                                        }}
                                        activeDot={{
                                            r: 6
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                <div className={styles.box_detalhes_mes}>

                    <div className={styles.box_cards_detalhes}>

                        <div className={styles.card_metrica_mes}>
                            <div className={styles.infos_metricas_mes}>
                                <p className={styles.titulo_card_mes}>Deduções e Impostos (-)</p>
                                <h3>{deducoesImpostos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                            </div>
                            {deducoesImpostos > 0 ? (
                                <Link className={styles.box_btn_mais_infos}
                                    onClick={() => {
                                        const grupoSelecionado = dadosFiltrados.find(g => g.grupo === 'DEDUCOES_DA_RECEITA_BRUTA');

                                        if (grupoSelecionado) {
                                            setDadosParaPopup(grupoSelecionado);
                                            setFraseCardSelecionado(frasesPorGrupo[grupoSelecionado.grupo] || '');
                                            setPopUpInfosDetalhesBi(true);
                                        }
                                    }}>
                                    <span><PiIcons.PiInfo /> Mais informações</span>
                                </Link>
                            ) : ('')}
                        </div>

                        <div className={styles.card_metrica_mes}>
                            <div className={styles.infos_metricas_mes}>
                                <p className={styles.titulo_card_mes}>Custo Variável (CPV ou CMV)</p>
                                <h3>{custoVariavel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                            </div>
                            {custoVariavel > 0 ? (
                                <Link className={styles.box_btn_mais_infos}
                                    onClick={() => {
                                        const grupoSelecionado = dadosFiltrados.find(g => g.grupo === 'CUSTO_VARIAVEL');

                                        if (grupoSelecionado) {
                                            setDadosParaPopup(grupoSelecionado);
                                            setFraseCardSelecionado(frasesPorGrupo[grupoSelecionado.grupo] || '');
                                            setPopUpInfosDetalhesBi(true);
                                        }
                                    }}>
                                    <span><PiIcons.PiInfo /> Mais informações</span>
                                </Link>
                            ) : ('')}
                        </div>

                        <div className={styles.card_metrica_mes}>
                            <div className={styles.infos_metricas_mes}>
                                <p className={styles.titulo_card_mes}>Despesas Operacionais</p>
                                <h3>{despesasOperacionais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                            </div>
                            {despesasOperacionais > 0 ? (
                                <Link className={styles.box_btn_mais_infos}
                                    onClick={() => {
                                        const grupoSelecionado = dadosFiltrados.find(g => g.grupo === 'DESPESAS_OPERACIONAIS');

                                        if (grupoSelecionado) {
                                            setDadosParaPopup(grupoSelecionado);
                                            setFraseCardSelecionado(frasesPorGrupo[grupoSelecionado.grupo] || '');
                                            setPopUpInfosDetalhesBi(true);
                                        }
                                    }}>
                                    <span><PiIcons.PiInfo /> Mais informações</span>
                                </Link>
                            ) : ('')}
                        </div>

                        <div className={styles.card_metrica_mes}>
                            <div className={styles.infos_metricas_mes}>
                                <p className={styles.titulo_card_mes}>Despesas Variáveis</p>
                                <h3>{despesasVariaveis.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                            </div>
                            {despesasVariaveis > 0 ? (
                                <Link className={styles.box_btn_mais_infos}
                                    onClick={() => {
                                        const grupoSelecionado = dadosFiltrados.find(g => g.grupo === 'DESPESAS_VARIAVEIS');

                                        if (grupoSelecionado) {
                                            setDadosParaPopup(grupoSelecionado);
                                            setFraseCardSelecionado(frasesPorGrupo[grupoSelecionado.grupo] || '');
                                            setPopUpInfosDetalhesBi(true);
                                        }
                                    }}>
                                    <span><PiIcons.PiInfo /> Mais informações</span>
                                </Link>
                            ) : ('')}
                        </div>

                        <div className={styles.card_metrica_mes}>
                            <div className={styles.infos_metricas_mes}>
                                <p className={styles.titulo_card_mes}>Despesas Financeiras</p>
                                <h3>{despesasFinanceiras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                            </div>
                            {despesasFinanceiras > 0 ? (
                                <Link className={styles.box_btn_mais_infos}
                                    onClick={() => {
                                        const grupoSelecionado = dadosFiltrados.find(g => g.grupo === 'DESPESAS_FINANCEIRAS');

                                        if (grupoSelecionado) {
                                            setDadosParaPopup(grupoSelecionado);
                                            setFraseCardSelecionado(frasesPorGrupo[grupoSelecionado.grupo] || '');
                                            setPopUpInfosDetalhesBi(true);
                                        }
                                    }}>
                                    <span><PiIcons.PiInfo /> Mais informações</span>
                                </Link>
                            ) : ('')}
                        </div>

                        <div className={styles.card_metrica_mes}>
                            <div className={styles.infos_metricas_mes}>
                                <p className={styles.titulo_card_mes}>Outras Despesas</p>
                                <h3>{outrasDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                            </div>
                            {outrasDespesas > 0 ? (
                                <Link className={styles.box_btn_mais_infos}
                                    onClick={() => {
                                        const grupoSelecionado = dadosFiltrados.find(g => g.grupo === 'OUTRAS_DESPESAS');

                                        if (grupoSelecionado) {
                                            setDadosParaPopup(grupoSelecionado);
                                            setFraseCardSelecionado(frasesPorGrupo[grupoSelecionado.grupo] || '');
                                            setPopUpInfosDetalhesBi(true);
                                        }
                                    }}>
                                    <span><PiIcons.PiInfo /> Mais informações</span>
                                </Link>
                            ) : ('')}
                        </div>

                        <div className={styles.card_metrica_mes}>
                            <div className={styles.infos_metricas_mes}>
                                <p className={styles.titulo_card_mes}>Saldo de Caixa</p>
                                <h3>{saldoDeCaixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                            </div>
                        </div>

                    </div>

                    <div className={styles.box_grafico_receitas_despesas}>
                        <div className={styles.header_grafico_receitas_despesas}>
                            <p>Receitas e Despesas <span>({capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado})</span></p>
                        </div>

                        <div className={styles.grafico_receitas_despesas}>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        activeIndex={activeIndex}
                                        activeShape={renderActiveShape}
                                        data={dataPizza}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={105}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        onMouseEnter={onPieEnter}
                                    >
                                        {dataPizza.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.name === 'Receitas' ? 'var(--cor-principal)' : 'var(--cor-grafico)'}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                <div className={styles.box_grafico_ultimos_12_meses}>
                    <div className={styles.header_grafico_ultimos_12_meses}>
                        <p>Receitas e Depesas <span>(Últimos 12 Meses)</span></p>

                        <div className={styles.header_descricao}>
                            <div className={`${styles.descricao_header} ${styles.descricao_receita}`}>
                                <span></span>
                                <p>Receita</p>
                            </div>
                            <div className={`${styles.descricao_header} ${styles.descricao_despesa}`}>
                                <span></span>
                                <p>Despesa</p>
                            </div>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart
                            data={dataAnual}
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >

                            <defs>
                                <linearGradient id="gradienteReceitas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--verde)" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="var(--verde)" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <defs>
                                <linearGradient id="gradienteDespesas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--vermelho)" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="var(--vermelho)" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 15" stroke="#eee" />
                            <XAxis dataKey="mes"
                                stroke="var(--border)"
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
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="receitas"
                                name="Receitas"
                                stroke="var(--verde)"
                                fill="url(#gradienteReceitas)"
                            />
                            <Area
                                type="monotone"
                                dataKey="despesas"
                                name="Despesas"
                                stroke="var(--vermelho)"
                                fill="url(#gradienteDespesas)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.box_graficos_categorias}>

                    <div className={styles.box_graficos}>

                        <div className={styles.box_grafico_pizza}>
                            <div className={styles.header_grafico_categorias}>
                                <p>Receitas por Categorias <span>({capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado})</span></p>

                                <div className={styles.box_btn_ordem} onClick={toggleOrdemReceitas}>
                                    {ordemDecrescenteReceitas ? <PiIcons.PiSortAscending /> : <PiIcons.PiSortDescending />}
                                </div>
                            </div>

                            <div className={styles.grafico_categorias}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            activeIndex={activeIndex}
                                            activeShape={renderActiveShape}
                                            data={pieDataReceitas}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={105}
                                            startAngle={90}
                                            endAngle={-270}
                                            onMouseEnter={onPieEnter}
                                            onClick={(data) => {
                                                setCategoriaReceitaSelecionada(data.name);
                                            }}
                                        >
                                            {pieDataReceitas.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={styles.box_legendas}>
                                {pieDataReceitas.map((entry) => (
                                    <div key={capitalizeFirstLetter(entry.name)} className={styles.legendas} onClick={() => setCategoriaReceitaSelecionada(entry.name)}>
                                        <div className={`${styles.box_nome_subcategoria} ${categoriaReceitaSelecionada === entry.name
                                            ? styles.ativo
                                            : ''
                                            }`}>
                                            <div
                                                className={styles.bolinha}
                                                style={{ backgroundColor: entry.color }}
                                            ></div>
                                            <span>{capitalizeFirstLetter(entry.name)}</span>
                                        </div>
                                        <div>
                                            <span className={styles.item_valor}>{entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                        </div>
                                        <div>
                                            <span className={styles.item_percentual}>{((entry.value / summary.receitas) * 100).toFixed(2)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.aviso_scroll_container}>
                                <PiIcons.PiCaretDoubleDown className={styles.icone_historico_categorias} /> <span>Histórico</span> <PiIcons.PiCaretDoubleDown className={styles.icone_historico_categorias} />
                            </div>
                        </div>

                        {categoriaReceitaSelecionada && (
                            <div className={styles.card_evolucao_categoria}>
                                <h3>
                                    <span>Histórico mensal:</span> <br></br>{capitalizeFirstLetter(categoriaReceitaSelecionada)}
                                </h3>

                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={evolucaoReceita}>
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
                                            formatter={(value) =>
                                                value.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })
                                            }
                                        />
                                        <Bar
                                            dataKey="valor"
                                            name="Valor"
                                            fill={corEvolucaoReceita}
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                    </div>

                    <div className={styles.box_graficos}>

                        <div className={styles.box_grafico_pizza}>
                            <div className={styles.header_grafico_categorias}>
                                <p>Despesas por Categorias <span>({capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado})</span></p>

                                <div className={styles.box_btn_ordem} onClick={toggleOrdemDespesas}>
                                    {ordemDecrescenteDespesas ? <PiIcons.PiSortAscending /> : <PiIcons.PiSortDescending />}
                                </div>
                            </div>

                            <div className={styles.grafico_categorias}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            activeIndex={activeIndex}
                                            activeShape={renderActiveShape}
                                            data={pieDataDespesas}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={105}
                                            startAngle={90}
                                            endAngle={-270}
                                            onMouseEnter={onPieEnter}
                                            onClick={(data) => {
                                                setCategoriaDespesaSelecionada(data.name);
                                            }}
                                        >
                                            {pieDataDespesas.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={styles.box_legendas_grafico}>
                                <div className={styles.box_legendas}>
                                    {pieDataDespesas.map((entry) => (
                                        <div key={capitalizeFirstLetter(entry.name)} className={styles.legendas} onClick={() => setCategoriaDespesaSelecionada(entry.name)}>
                                            <div className={styles.box_nome_subcategoria} >
                                                <div
                                                    className={styles.bolinha}
                                                    style={{ backgroundColor: entry.color }}
                                                ></div>
                                                <span>{capitalizeFirstLetter(entry.name)}</span>
                                            </div>
                                            <div>
                                                <span className={styles.item_valor}>{entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                            </div>
                                            <div>
                                                <span className={styles.item_percentual}>{((entry.value / summary.despesas) * 100).toFixed(2)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.aviso_scroll_container}>
                                <PiIcons.PiCaretDoubleDown className={styles.icone_historico_categorias} /> <span>Histórico</span> <PiIcons.PiCaretDoubleDown className={styles.icone_historico_categorias} />
                            </div>
                        </div>

                        {categoriaDespesaSelecionada && (
                            <div className={styles.card_evolucao_categoria}>
                                <h3>
                                    <span>Histórico mensal:</span> <br></br>{capitalizeFirstLetter(categoriaDespesaSelecionada)}
                                </h3>

                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={evolucaoDespesa}>
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
                                            formatter={(value) =>
                                                value.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })
                                            }
                                        />
                                        <Bar
                                            dataKey="valor"
                                            name="Valor"
                                            fill={corEvolucaoDespesa}
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                    </div>

                </div>

            </div>

            <InfosDetalhesBi
                trigger={popUpInfosDetalhesBi}
                setTrigger={setPopUpInfosDetalhesBi}
                dadosCard={dadosParaPopup}
                frase={fraseCardSelecionado}
            />
        </div>
    )
}
