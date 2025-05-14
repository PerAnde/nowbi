import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { buscarDashboardBi } from '../../../../services/dashboardBi';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import styles from './DashboardBi.module.scss';
import './dre.css'
import { LayoutBi } from '../../../../layout/LayoutBi/LayoutBi';
import * as PiIcons from 'react-icons/pi';
import { exportarParaExcel } from '../../../../utils/exportExcel'
import { salvarDRE } from '../../../../utils/salvarPDF'
import { SelectMesEmpresa } from '../../../../components/Selects/SelectMesEmpresa';
import { SelectAnoEmpresa } from '../../../../components/Selects/SelectAnoEmpresa';

const COLORS = [
    "#3789da", "#ff8a5c", "#8378ea",
    "#ffa55c", "#37a2da", "#ff6f5c",
    "#ffc05c", "#eb5555", "#fff35c",
    "#d655eb", "#ffdb5c", "#7893ea",
    "#9678ea", "#37dac2", "#7880ea",
    "#37cbda", "#37bcda", "#37daa6",
    "#eb5587", "#eb55cf", "#78b8ea",
    "#eb55ab", "#78a5ea", "#eb6755",
]

const processBIData = (empresa, selectedMonth) => {
    const mesesAtivos = empresa.bis.filter(bi => bi.status);
    const result = {};
    let totalReceitas = 0;
    let totalDespesas = 0;
    // const categorias = {};
    const categoriasPorGrupo = {};
    const subcategorias = {};
    const detalhes = [];

    mesesAtivos.forEach(({ mes, ano, lancamentoBi }) => {
        const mesAnoAtual = `${mes.toUpperCase()} / ${ano}`;

        // Comparação do mês selecionado, ambos em maiúsculas
        if (selectedMonth && mesAnoAtual !== selectedMonth.toUpperCase()) return;

        // if (selectedMonth && mesAnoAtual !== selectedMonth) return; // Comparação correta

        if (!result[mesAnoAtual]) {
            result[mesAnoAtual] = { receitas: 0, despesas: 0 };
        }

        lancamentoBi.forEach(({ valor, tipo, categoria, subcategoria }) => {
            const valorNum = parseFloat(valor);
            detalhes.push({
                mes: mesAnoAtual,
                tipo,
                valor: valorNum,
                categoria: categoria?.name,
                grupoDre: categoria?.grupoDre,
                subcategoria: subcategoria?.name
            });

            if (tipo === "RECEITA") {
                result[mesAnoAtual].receitas += valorNum;
                totalReceitas += valorNum;
            } else if (tipo === "DESPESA") {
                result[mesAnoAtual].despesas += valorNum;
                totalDespesas += valorNum;
            }

            if (categoria) {
                // Adiciona a categoria ao grupo correspondente no agrupamento
                if (!categoriasPorGrupo[categoria.grupoDre]) {
                    categoriasPorGrupo[categoria.grupoDre] = [];
                }
                categoriasPorGrupo[categoria.grupoDre].push(categoria.name);
            }

            if (subcategoria) {
                subcategorias[subcategoria.name] = (subcategorias[subcategoria.name] || 0) + valorNum;
            }

        });
    });

    return { result, summary: { receitas: totalReceitas, despesas: totalDespesas, categoriasPorGrupo, subcategorias, detalhes } };
};

export const DashboardBi = () => {

    const { link_bi } = useParams();
    const [empresa, setEmpresa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("");

    const [mesSelecionado, setMesSelecionado] = useState('');
    const [anoSelecionado, setAnoSelecionado] = useState('');

    const [mesesDisponiveis, setMesesDisponiveis] = useState([]);
    const [anosDisponiveis, setAnosDisponiveis] = useState([]);

    const [abaAtiva, setViewMode] = useState("resumo");
    const navigate = useNavigate();

    const [graficoMobile, setGraficoMobile] = useState(window.innerWidth < 800);
    const [dadoHoverGrafico, setDadoHoverGrafico] = useState(null);

    useEffect(() => {
        const handleResize = () => setGraficoMobile(window.innerWidth < 800);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Efeito hover grafico pizza:
    const handlePieEnter = (_, index) => {
        setDadoHoverGrafico(index);
    };

    const handlePieLeave = () => {
        setDadoHoverGrafico(null);
    };

    const monthOrder = {
        "janeiro": { num: 1, abbr: "Jan" }, "fevereiro": { num: 2, abbr: "Fev" }, "março": { num: 3, abbr: "Mar" },
        "abril": { num: 4, abbr: "Abr" }, "maio": { num: 5, abbr: "Mai" }, "junho": { num: 6, abbr: "Jun" },
        "julho": { num: 7, abbr: "Jul" }, "agosto": { num: 8, abbr: "Ago" }, "setembro": { num: 9, abbr: "Set" },
        "outubro": { num: 10, abbr: "Out" }, "novembro": { num: 11, abbr: "Nov" }, "dezembro": { num: 12, abbr: "Dez" }
    };

    useEffect(() => {
        buscarDashboardBi(link_bi, setEmpresa, setLoading, navigate);
    }, [link_bi]);

    useEffect(() => {
        if (!empresa || !empresa.bis.length) return;

        const bisAtivos = empresa.bis.filter(bi => bi.status);

        const mesesUnicos = [...new Set(bisAtivos.map(bi => bi.mes.toLowerCase()))]
            .sort((a, b) => monthOrder[a].num - monthOrder[b].num);

        const anosUnicos = [...new Set(bisAtivos.map(bi => bi.ano))]
            .sort((a, b) => a - b);

        setMesesDisponiveis(mesesUnicos);
        setAnosDisponiveis(anosUnicos);

        // Garantir que o último mês e ano sejam definidos corretamente
        const ultimoBI = bisAtivos
            .sort((a, b) => a.ano - b.ano || monthOrder[a.mes.toLowerCase()].num - monthOrder[b.mes.toLowerCase()].num)
            .at(-1);

        const mes = ultimoBI.mes.toLowerCase();
        const ano = ultimoBI.ano;

        setMesSelecionado(mes);
        setAnoSelecionado(ano);

        // Definindo o mês selecionado como o último mês por padrão
        setSelectedMonth(`${mes} / ${ano}`);

    }, [empresa]);

    useEffect(() => {
        if (mesSelecionado && anoSelecionado) {
            const mesCapitalizado = mesSelecionado.toUpperCase();  // Garantir maiúsculas
            setSelectedMonth(`${mesCapitalizado} / ${anoSelecionado}`);
        }
    }, [mesSelecionado, anoSelecionado]);

    useEffect(() => {
        if (empresa && selectedMonth) {
            const bisAtivosOrdenados = empresa.bis
                .filter(bi => bi.status)
                .sort((a, b) => a.ano - b.ano || monthOrder[a.mes.toLowerCase()].num - monthOrder[b.mes.toLowerCase()].num);

            const indexAtual = bisAtivosOrdenados.findIndex(bi =>
                `${bi.mes.toUpperCase()} / ${bi.ano}` === selectedMonth.toUpperCase()
            );

            const biAtual = bisAtivosOrdenados[indexAtual];
            const biAnterior = bisAtivosOrdenados[indexAtual - 1];

            const dadosAtuais = processBIData(empresa, `${biAtual.mes.toUpperCase()} / ${biAtual.ano}`);
            const dadosAnteriores = biAnterior ? processBIData(empresa, `${biAnterior.mes.toUpperCase()} / ${biAnterior.ano}`) : null;

            const receitaAtual = dadosAtuais.summary.receitas;
            const receitaAnterior = dadosAnteriores?.summary.receitas || 0;

            const despesaAtual = dadosAtuais.summary.despesas;
            const despesaAnterior = dadosAnteriores?.summary.despesas || 0;

            const diferencaPercentualReceita = receitaAnterior
                ? ((receitaAtual - receitaAnterior) / receitaAnterior) * 100
                : 0;

            const diferencaPercentualDespesa = despesaAnterior
                ? ((despesaAtual - despesaAnterior) / despesaAnterior) * 100
                : 0;

            setDashboardData({
                ...dadosAtuais,
                diferencaPercentualReceita,
                diferencaPercentualDespesa
            });
        }
    }, [empresa, selectedMonth]);

    if (loading || !dashboardData) {
        return <p>Carregando...</p>;
    }

    const { summary } = dashboardData;

    const barData = empresa.bis
        .filter(bi => bi.status) // Filtra apenas os meses ativos
        .sort((a, b) => a.ano - b.ano || monthOrder[a.mes.toLowerCase()].num - monthOrder[b.mes.toLowerCase()].num) // Ordenação correta
        .slice(-12) // Pega os últimos 12 meses após ordenar
        .map(({ mes, ano, lancamentoBi }) => {
            let receitas = 0;
            let despesas = 0;

            lancamentoBi.forEach(({ valor, tipo }) => {
                const valorNum = parseFloat(valor);
                if (tipo === "RECEITA") {
                    receitas += valorNum;
                } else if (tipo === "DESPESA") {
                    despesas += valorNum;
                }
            });

            return {
                month: `${monthOrder[mes.toLowerCase()].abbr}/${String(ano)}`, // Formato "Abr/24"
                receitas,
                despesas
            };
        });

    const receitasSubcategorias = {};
    const despesasSubcategorias = {};

    summary.detalhes.forEach(({ tipo, subcategoria, valor }) => {
        if (!subcategoria) return; // Ignora caso não tenha subcategoria

        if (tipo === "RECEITA") {
            receitasSubcategorias[subcategoria] = (receitasSubcategorias[subcategoria] || 0) + valor;
        } else if (tipo === "DESPESA") {
            despesasSubcategorias[subcategoria] = (despesasSubcategorias[subcategoria] || 0) + valor;
        }
    });

    // Transformar os objetos em arrays para os gráficos
    const pieDataReceitas = Object.entries(receitasSubcategorias)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.value - b.value);
    const pieDataDespesas = Object.entries(despesasSubcategorias)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.value - b.value);

    // DRE
    // Separando os dados
    const receitas = summary.detalhes.filter(item => item.tipo === 'RECEITA');
    const despesas = summary.detalhes.filter(item => item.tipo === 'DESPESA');

    // Agrupando categorias
    const agruparPorCategoria = (dados) => {
        return dados.reduce((acc, item) => {
            if (!acc[item.categoria]) {
                acc[item.categoria] = { total: 0, subcategorias: {} };
            }
            acc[item.categoria].total += item.valor;
            if (item.subcategoria) {
                if (!acc[item.categoria].subcategorias[item.subcategoria]) {
                    acc[item.categoria].subcategorias[item.subcategoria] = 0;
                }
                acc[item.categoria].subcategorias[item.subcategoria] += item.valor;
            }
            return acc;
        }, {});
    };

    const receitasAgrupadas = agruparPorCategoria(receitas);
    const despesasAgrupadas = agruparPorCategoria(despesas);

    const lucroBruto = summary.receitas - summary.despesas;

    const custos = Object.entries(despesasAgrupadas).find(
        ([categoria]) => categoria.toLowerCase() === "custos"
    )?.[1]?.total || 0;


    const despesasOrdenadas = Object.entries(despesasAgrupadas).sort(([catA], [catB]) => {
        if (catA.toLowerCase() === "despesas financeiras") return 1; // Move "Despesas Financeiras" para o final
        if (catB.toLowerCase() === "despesas financeiras") return -1;
        return 0;
    });

    // Buscando despesas comerciais
    const despesasComerciais = Object.entries(despesasAgrupadas).find(
        ([categoria]) => categoria.toLowerCase() === "despesas comerciais"
    )?.[1]?.total || 0;
    // Buscando despesas administrativas
    const despesasAdministrativas = Object.entries(despesasAgrupadas).find(
        ([categoria]) => categoria.toLowerCase() === "despesas administrativas"
    )?.[1]?.total || 0;
    // Buscando despesas pessoal
    const despesasComPessoal = Object.entries(despesasAgrupadas).find(
        ([categoria]) => categoria.toLowerCase() === "despesas com pessoal"
    )?.[1]?.total || 0;
    // Buscando despesas comerciais
    const despesasFinanceiras = Object.entries(despesasAgrupadas).find(
        ([categoria]) => categoria.toLowerCase() === "despesas financeiras"
    )?.[1]?.total || 0;

    // Margem de contribuição
    const margemDeContribuicao = summary.receitas - custos - despesasComerciais;
    const margemDeContribuicaoPercentual = summary.receitas > 0
        ? ((margemDeContribuicao / summary.receitas) * 100).toFixed(2)
        : "0.00";

    // Ponto de equilíbrio
    const pontoDeEquilibrio = despesasAdministrativas + despesasComPessoal + despesasFinanceiras;
    const resultadoPontoDeEquilibrio = pontoDeEquilibrio / margemDeContribuicaoPercentual * 100

    // Receita Operacional Líquida
    // const receitaLiquida = summary.receitas - deducoesImpostos;

    // Filtro grupos de DRE
    const gruposDeDRE = [
        { titulo: 'Receita Operacional Bruta (+)', grupo: 'RECEITA_OPERACIONAL_BRUTA' },
        { titulo: 'Deduções e Impostos (-)', grupo: 'DEDUCOES_DA_RECEITA_BRUTA' },
        { titulo: 'Receita Financeira', grupo: 'RECEITA_FINANCEIRA' },
        { titulo: 'Custo Variável (CPV ou CMV)', grupo: 'CUSTO_VARIAVEL' },
        { titulo: 'Outras Receitas', grupo: 'OUTRAS_RECEITAS' },
        { titulo: 'Despesas Operacionais', grupo: 'DESPESAS_OPERACIONAIS' },
        { titulo: 'Despesas Financeiras', grupo: 'DESPESAS_FINANCEIRAS' },
        { titulo: 'Outras Despesas', grupo: 'OUTRAS_DESPESAS' },
        { titulo: 'Impostos (IR e CSLL)', grupo: 'IR_CSLL' }
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

            // Depois de Deduções, inserir Receita Operacional Líquida
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

            if (grupo.grupo === 'IR_CSLL') {
                resultado.push({
                    titulo: 'Lucro/Prejuízo Acumulado',
                    grupo: 'LUCRO_PREJUIZO_ACUMULADO',
                    dados: {
                        total: lucroBruto,
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
        <LayoutBi empresa={empresa} abaAtiva={abaAtiva} setViewMode={setViewMode}>
            <div className={styles.box_dashboard_bi}>

                <div className={styles.box_filtro_e_resumo}>

                    <div className={styles.box_header_pagina}>
                        <div className={styles.box_descricao_pagina}>
                            {abaAtiva === "resumo" ? <h3>Resumo</h3> : <h3>Demonstração do Resultado do Exercício (DRE)</h3>}
                        </div>

                        <div className={styles.box_filtro_mes_ano}>
                            <SelectMesEmpresa mesSelecionado={mesSelecionado} setMesSelecionado={setMesSelecionado} mesesDisponiveis={mesesDisponiveis} />
                            <SelectAnoEmpresa anoSelecionado={anoSelecionado} setAnoSelecionado={setAnoSelecionado} anosDisponiveis={anosDisponiveis} />
                        </div>
                    </div>

                    <div className={styles.box_infos_resumo}>
                        <div className={`${styles.box_dados_background} ${styles.ativo}`}>
                            <div className={styles.box_dados}>
                                <span className={`${styles.box_icone_dados} ${styles.icone_receita}`}>
                                    <PiIcons.PiArrowUpRightBold />
                                </span>
                                <div className={styles.infos_dados}>
                                    <p>Receitas</p>
                                    <span>{summary.receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            </div>
                            <div className={`${styles.box_info_mes_anterior} ${styles.mes_anterior_receita}`}>
                                <div className={styles.infos_mes}>
                                    <div className={styles.descricao_mes_anterior}>
                                        {dashboardData.diferencaPercentualReceita >= 0 ? <PiIcons.PiCaretDoubleUpDuotone /> : <PiIcons.PiCaretDoubleDownDuotone />}
                                        {dashboardData.diferencaPercentualReceita > 0 ? '+' : ''}
                                        {dashboardData.diferencaPercentualReceita.toFixed(2)}%
                                    </div>
                                    <div className={styles.popup_info_mes}>
                                        <p>Diferença relacionada<br></br> ao mês anterior.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.box_dados_background}`}>
                            <div className={styles.box_dados}>
                                <span className={`${styles.box_icone_dados} ${styles.icone_despesa}`}>
                                    <PiIcons.PiArrowDownRightBold />
                                </span>
                                <div className={styles.infos_dados}>
                                    <p>Despesas</p>
                                    <span>{summary.despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            </div>
                            <div className={`${styles.box_info_mes_anterior} ${styles.mes_anterior_despesa}`}>
                                <div className={styles.infos_mes}>
                                    <div className={styles.descricao_mes_anterior}>
                                        {dashboardData.diferencaPercentualDespesa >= 0 ? <PiIcons.PiCaretDoubleUpDuotone /> : <PiIcons.PiCaretDoubleDownDuotone />}
                                        {dashboardData.diferencaPercentualDespesa > 0 ? '+' : ''}
                                        {dashboardData.diferencaPercentualDespesa.toFixed(2)}%
                                    </div>
                                    <div className={styles.popup_info_mes}>
                                        <p>Diferença relacionada<br></br> ao mês anterior.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.box_dados_background}`}>
                            <div className={styles.box_dados}>
                                <span className={`${styles.box_icone_dados} ${styles.icone_equilibrio}`}>
                                    <PiIcons.PiScales />
                                </span>
                                <div className={styles.infos_dados}>
                                    <p>Ponto de Equilíbrio</p>
                                    <span>{resultadoPontoDeEquilibrio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            </div>
                            <div className={styles.box_info_mes_anterior}>
                                <div className={styles.infos_mes}>
                                    <div className={styles.descricao_mes_anterior}>
                                        <PiIcons.PiInfo />
                                    </div>
                                    <div className={styles.popup_info_mes}>
                                        <p>Custos Fixos ÷ Margem de Contribuição</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.box_dados_background}`}>
                            <div className={styles.box_dados}>
                                <span className={`${styles.box_icone_dados} ${styles.icone_margem}`}>
                                    <PiIcons.PiChartPieSlice />
                                </span>
                                <div className={styles.infos_dados}>
                                    <p>Margem de Contribuição</p>
                                    <p><span>{margemDeContribuicao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> ({margemDeContribuicaoPercentual}%)</p>
                                </div>
                            </div>
                            <div className={styles.box_info_mes_anterior}>
                                <div className={styles.infos_mes}>
                                    <div className={styles.descricao_mes_anterior}>
                                        <PiIcons.PiInfo />
                                    </div>
                                    <div className={styles.popup_info_mes}>
                                        <p>Receitas - Custos variáveis</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {abaAtiva === "resumo" ? (
                    <>
                        <div className={styles.box_grafico_anual}>

                            <span className={styles.box_descricao_meses}>
                                <PiIcons.PiCalendar />
                                <p>12 meses</p>
                            </span>

                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-input)" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="var(--texto-secundario)"
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
                                    <Legend
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        iconType="circle"
                                        wrapperStyle={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "var(--border-radius-componente)",
                                            padding: "4rem 0 0 0",
                                            color: "var(--cor-primaria)",
                                            fontSize: "1.4rem",
                                        }}
                                    />
                                    <Bar dataKey="receitas" fill="var(--cor-primaria)" name="Receitas" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="despesas" fill="#e83a3a" name="Despesas" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>

                        </div>

                        <div className={styles.box_grafico}>

                            <div className={styles.box_donut}>
                                <div className={styles.donut}>
                                    <div className={styles.descricao_donut}>
                                        <span>Total</span>
                                        <p>Receitas</p>
                                    </div>
                                    <ResponsiveContainer width={350} height={350}>
                                        <PieChart>
                                            <Pie
                                                data={pieDataReceitas}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={graficoMobile ? 75 : 85}
                                                outerRadius={graficoMobile ? 130 : 150}
                                                startAngle={90}
                                                endAngle={-270}
                                                stroke="none"
                                                onMouseLeave={handlePieLeave}
                                            >
                                                {pieDataReceitas.map((entry, index) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={COLORS[index % COLORS.length]}
                                                        opacity={dadoHoverGrafico === null || dadoHoverGrafico === index ? 1 : 0.6}
                                                        onMouseEnter={() => handlePieEnter(null, index)}
                                                    />
                                                ))}
                                            </Pie>

                                            <Tooltip formatter={(value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                contentStyle={{ background: "var(--branco)", color: "var(--texto-primario)", borderRadius: "var(--border-radius-componente)", border: '1px solid var(--texto-secundario)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className={styles.box_legendas}>
                                    {pieDataReceitas.map((entry) => (
                                        <div key={entry.name} className={styles.legendas}>
                                            <span
                                                className={styles.bolinha}
                                                style={{ backgroundColor: COLORS[pieDataReceitas.findIndex(e => e.name === entry.name) % COLORS.length] }}
                                            ></span>
                                            <span>{entry.name}</span>
                                            <span className={styles.item_valor}>{entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                            <span className={styles.item_percentual}>{((entry.value / summary.receitas) * 100).toFixed(2)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className={styles.box_grafico}>

                            <div className={styles.box_donut}>
                                <div className={styles.donut}>
                                    <div className={styles.descricao_donut}>
                                        <span>Total</span>
                                        <p>Despesas</p>
                                    </div>
                                    <ResponsiveContainer width={350} height={350}>
                                        <PieChart>
                                            <Pie
                                                data={pieDataDespesas}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={graficoMobile ? 75 : 85}
                                                outerRadius={graficoMobile ? 130 : 150}
                                                startAngle={90}
                                                endAngle={-270}
                                                stroke="none"
                                                onMouseLeave={handlePieLeave}
                                            >
                                                {pieDataDespesas.map((entry, index) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={COLORS[index % COLORS.length]}
                                                        opacity={dadoHoverGrafico === null || dadoHoverGrafico === index ? 1 : 0.6}
                                                        onMouseEnter={() => handlePieEnter(null, index)}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                contentStyle={{ background: "var(--branco)", color: "var(--texto-primario)", borderRadius: "var(--border-radius-componente)", border: '1px solid var(--texto-secundario)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className={styles.box_legendas}>
                                    {pieDataDespesas.map((entry) => (
                                        <div key={entry.name} className={styles.legendas}>
                                            <span
                                                className={styles.bolinha}
                                                style={{ backgroundColor: COLORS[pieDataDespesas.findIndex(e => e.name === entry.name) % COLORS.length] }}
                                            ></span>
                                            <span>{entry.name}</span>
                                            <span className={styles.item_valor}>{entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                            <span className={styles.item_percentual}>{((entry.value / summary.receitas) * 100).toFixed(2)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>

                ) : (

                    <div className="dreContainer">

                        <div className="box_topo_dre">
                            <h2>Demonstração do Resultado do Exercício (DRE)</h2>
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
                                        <p><strong>AV.</strong></p>
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
                                        {Object.entries(grupo.dados.categorias).map(([categoria, dados]) => (
                                            <React.Fragment key={categoria}>
                                                <div key={categoria} className="box_categorias_dre">
                                                    <p>{categoria}</p>
                                                    <p>{dados.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                                    <p>{((dados.total / summary.receitas) * 100).toFixed(2)}%</p>
                                                </div>
                                                {/* Subcategorias */}
                                                {Object.entries(dados.subcategorias).map(([sub, valor]) => (
                                                    <div key={sub} className="box_subcategorias_dre">
                                                        <p><PiIcons.PiArrowElbowDownRight className="icone_subcategoria_dre" /> {sub}</p>
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

                )}

            </div>
        </LayoutBi >
    );
};
