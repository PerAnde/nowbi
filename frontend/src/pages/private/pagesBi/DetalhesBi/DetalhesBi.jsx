import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { AreaChart, CartesianGrid, XAxis, Tooltip, Area, Cell, Sector, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { useBiPublic } from '../../../../contexts/BiPublicContext'
import { SelectMesBi } from '../../../../components/Selects/SelectMesBi'
import { SelectAnoBi } from '../../../../components/Selects/SelectAnoBi'
import { agruparPorGrupo } from '../../../../utils/agruparPorGrupo'
import { gruposDeDRE } from '../../../../utils/gruposDeDRE'
import { frasesPorGrupo } from '../../../../utils/frasesPorGrupo'
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'
import { CoresGraficos } from '../../../../utils/coresGraficos';

import { InfosDetalhesBi } from '../../../../components/Modal/InfosDetalhesBi/InfosDetalhesBi'

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
        mesesDisponiveis,
        anosDisponiveis,
        loading
    } = useBiPublic()

    const [activeIndex, setActiveIndex] = useState(0);
    const [ordemDecrescenteReceitas, setOrdemDecrescenteReceitas] = useState(true);
    const [ordemDecrescenteDespesas, setOrdemDecrescenteDespesas] = useState(true);
    const [graficoMobile, setGraficoMobile] = useState(window.innerWidth < 800);

    const [popUpInfosDetalhesBi, setPopUpInfosDetalhesBi] = useState(false)
    const [dadosParaPopup, setDadosParaPopup] = useState(null);
    const [fraseCardSelecionado, setFraseCardSelecionado] = useState('');

    useEffect(() => {
        const handleResize = () => setGraficoMobile(window.innerWidth < 800);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const monthOrder = {
        "janeiro": { num: 1, abbr: "Jan" }, "fevereiro": { num: 2, abbr: "Fev" }, "março": { num: 3, abbr: "Mar" },
        "abril": { num: 4, abbr: "Abr" }, "maio": { num: 5, abbr: "Mai" }, "junho": { num: 6, abbr: "Jun" },
        "julho": { num: 7, abbr: "Jul" }, "agosto": { num: 8, abbr: "Ago" }, "setembro": { num: 9, abbr: "Set" },
        "outubro": { num: 10, abbr: "Out" }, "novembro": { num: 11, abbr: "Nov" }, "dezembro": { num: 12, abbr: "Dez" }
    };

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

    const { summary, diferencaPercentualReceita, diferencaPercentualDespesa } = dashboardData

    const receitasSubcategorias = {};
    const despesasSubcategorias = {};

    summary.detalhes.forEach(({ tipo, subcategoria, valor }) => {
        if (!subcategoria) return;

        if (tipo === 'RECEITA') {
            receitasSubcategorias[subcategoria] = (receitasSubcategorias[subcategoria] || 0) + valor;
        }

        if (tipo === 'DESPESA') {
            despesasSubcategorias[subcategoria] = (despesasSubcategorias[subcategoria] || 0) + valor;
        }
    });

    // Dados para gerar calculos
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

    // Data grafico pizza receitas e despesas
    const dataPizza = [
        { name: 'Receitas', value: summary.receitas },
        { name: 'Despesas', value: summary.despesas },
    ];

    // Filtra e organiza os dados
    const agruparDados = (dados) => {
        const dadosAgrupados = agruparPorGrupo(dados);
        const resultado = [];

        gruposDeDRE.forEach((grupo, index) => {
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

        // QUEBRANDO EM DUAS LINHAS SE NECESSÁRIO
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
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
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
        .slice(-12)
        .reverse()
        .map(({ mes, ano, lancamentoBi }) => {
            let receitas = 0;
            let despesas = 0;

            lancamentoBi.forEach(({ valor, tipo }) => {
                const valorNum = parseFloat(valor);
                if (tipo === 'RECEITA') receitas += valorNum;
                if (tipo === 'DESPESA') despesas += valorNum;
            });

            return {
                mes: capitalizeFirstLetter(`${mes.slice(0, 3)}/${ano.toString().slice(-2)}`),
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
                        border: '1px solid var(--texto-secundario)',
                        borderRadius: 'var(--border-radius-componente)',
                        padding: '10px',
                    }}
                >
                    <p style={{ color: 'var(--texto-primario)', marginBottom: '6px' }}>{label}</p>

                    {payload.map((entry, i) => (
                        <p
                            key={i}
                            style={{
                                color: entry.name === 'Despesas' ? 'var(--texto-secundario)' : 'var(--cor-primaria)',
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

    // Transformar os objetos em arrays para os gráficos
    const pieDataReceitas = Object.entries(receitasSubcategorias)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => ordemDecrescenteReceitas ? b.value - a.value : a.value - b.value);
    const pieDataDespesas = Object.entries(despesasSubcategorias)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => ordemDecrescenteDespesas ? b.value - a.value : a.value - b.value);

    // Funcao muda ordem dos dados, maior para menor e vice-versa
    const toggleOrdemReceitas = () => {
        setOrdemDecrescenteReceitas((prev) => !prev);
    };
    const toggleOrdemDespesas = () => {
        setOrdemDecrescenteDespesas((prev) => !prev);
    };

    return (
        <div className={styles.box_dashboard_bi}>

            <div className={styles.header_pagina_dashboardBi}>
                <h3>Detalhes {capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</h3>

                <div className={styles.box_filtro_mes_ano}>
                    <div className={styles.filtros_mes_ano}>
                        <SelectMesBi mesSelecionado={mesSelecionado} setMesSelecionado={setMesSelecionado} mesesDisponiveis={mesesDisponiveis} />
                        <SelectAnoBi anoSelecionado={anoSelecionado} setAnoSelecionado={setAnoSelecionado} anosDisponiveis={anosDisponiveis} />
                    </div>
                </div>
            </div>

            <div className={styles.box_pagina_bi}>

                <div className={styles.box_resumo_detalhes_mes}>

                    <div className={`${styles.card_resumo_detalhes_mes} ${styles.card_receitas}`}>
                        <div className={styles.infos_detalhes_mes}>
                            <p className={styles.titulo_card_mes}>Receitas</p>
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
                        <span className={`${styles.icone_card_mes} ${styles.icone_receitas}`}><PiIcons.PiArrowUpRight /></span>
                    </div>

                    <div className={`${styles.card_resumo_detalhes_mes} ${styles.card_despesas}`}>
                        <div className={styles.infos_detalhes_mes}>
                            <p className={styles.titulo_card_mes}>Despesas</p>
                            <span>{summary.despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            {diferencaPercentualDespesa >= 0 ?
                                <div className={`${styles.infos_mes_anterior} ${styles.negativo}`}>
                                    <i><PiIcons.PiCaretDoubleUpDuotone /></i>
                                    <p className={styles.info_positivo}><span>+{Math.abs(diferencaPercentualDespesa).toFixed(2)}%</span> em relação ao mês anterior</p>
                                </div>
                                :
                                <div className={`${styles.infos_mes_anterior} ${styles.positivo}`}>
                                    <i><PiIcons.PiCaretDoubleDownDuotone /></i>
                                    <p className={styles.info_positivo}><span>-{Math.abs(diferencaPercentualDespesa).toFixed(2)}%</span> em relação ao mês anterior</p>
                                </div>
                            }
                        </div>
                        <span className={`${styles.icone_card_mes} ${styles.icone_despesas}`}><PiIcons.PiArrowDownRight /></span>
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
                                    <PiIcons.PiInfo /> Mais informações
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
                                    <PiIcons.PiInfo /> Mais informações
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
                                    <PiIcons.PiInfo /> Mais informações
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
                                    <PiIcons.PiInfo /> Mais informações
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
                                    <PiIcons.PiInfo /> Mais informações
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
                                    <PiIcons.PiInfo /> Mais informações
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
                                        innerRadius={70}
                                        outerRadius={95}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        onMouseEnter={onPieEnter}
                                    >
                                        {dataPizza.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.name === 'Receitas' ? 'var(--cor-primaria)' : 'var(--cor-grafico)'}
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
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-input)" />
                            <XAxis dataKey="mes"
                                stroke="var(--border-input)"
                                tick={{ fill: 'var(--texto-secundario)' }}
                                style={
                                    { fontSize: graficoMobile ? 12 : 16 }
                                }
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="receitas"
                                name="Receitas"
                                stroke="var(--cor-primaria)"
                                fill="var(--cor-primaria)"
                            />
                            <Area
                                type="monotone"
                                dataKey="despesas"
                                name="Despesas"
                                stroke="var(--cor-grafico)"
                                fill="var(--cor-grafico-anual)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.box_graficos_subcategorias}>

                    <div className={styles.box_grafico_pizza}>
                        <div className={styles.header_grafico_subcategorias}>
                            <p>Receitas por Subcategorias <span>({capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado})</span></p>

                            <div className={styles.box_btn_ordem} onClick={toggleOrdemReceitas}>
                                {ordemDecrescenteReceitas ? <PiIcons.PiSortAscending /> : <PiIcons.PiSortDescending />}
                            </div>
                        </div>

                        <div className={styles.grafico_subcategorias}>
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
                                        innerRadius={70}
                                        outerRadius={95}
                                        startAngle={90}
                                        endAngle={-270}
                                        onMouseEnter={onPieEnter}
                                    >
                                        {pieDataReceitas.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CoresGraficos[index % CoresGraficos.length]}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={styles.box_legendas}>
                            {pieDataReceitas.map((entry) => (
                                <div key={capitalizeFirstLetter(entry.name)} className={styles.legendas}>
                                    <div className={styles.box_nome_subcategoria}>
                                        <div
                                            className={styles.bolinha}
                                            style={{ backgroundColor: CoresGraficos[pieDataReceitas.findIndex(e => e.name === entry.name) % CoresGraficos.length] }}
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
                    </div>

                    <div className={styles.box_grafico_pizza}>
                        <div className={styles.header_grafico_subcategorias}>
                            <p>Despesas por Subcategorias <span>({capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado})</span></p>

                            <div className={styles.box_btn_ordem} onClick={toggleOrdemDespesas}>
                                {ordemDecrescenteDespesas ? <PiIcons.PiSortAscending /> : <PiIcons.PiSortDescending />}
                            </div>
                        </div>

                        <div className={styles.grafico_subcategorias}>
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
                                        innerRadius={70}
                                        outerRadius={95}
                                        startAngle={90}
                                        endAngle={-270}
                                        onMouseEnter={onPieEnter}
                                    >
                                        {pieDataDespesas.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CoresGraficos[index % CoresGraficos.length]}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={styles.box_legendas_grafico}>
                            <div className={styles.box_legendas}>
                                {pieDataDespesas.map((entry) => (
                                    <div key={capitalizeFirstLetter(entry.name)} className={styles.legendas}>
                                        <div className={styles.box_nome_subcategoria}>
                                            <div
                                                className={styles.bolinha}
                                                style={{ backgroundColor: CoresGraficos[pieDataDespesas.findIndex(e => e.name === entry.name) % CoresGraficos.length] }}
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
