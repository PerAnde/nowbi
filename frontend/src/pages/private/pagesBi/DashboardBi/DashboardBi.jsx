import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { buscarDashboardBi } from '../../../../services/dashboardBi';
import { processaDadosBi } from '../../../../utils/processaDadosBi';
import { CoresGraficos } from '../../../../utils/coresGraficos';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import styles from './DashboardBi.module.scss';
import './dre.css'
import { LayoutBi } from '../../../../layout/LayoutBi/LayoutBi';
import * as PiIcons from 'react-icons/pi';
import { salvarDRE } from '../../../../utils/salvarPDF'
import { SelectMesEmpresa } from '../../../../components/Selects/SelectMesEmpresa';
import { SelectAnoEmpresa } from '../../../../components/Selects/SelectAnoEmpresa';
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'

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

    const [ordemDecrescenteReceitas, setOrdemDecrescenteReceitas] = useState(true);
    const [ordemDecrescenteDespesas, setOrdemDecrescenteDespesas] = useState(true);

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

            if (indexAtual === -1) {
                alert("Não há BI lançado para esse mês/ano.");
                window.location.reload();
                return;
            }

            const biAtual = bisAtivosOrdenados[indexAtual];
            const biAnterior = bisAtivosOrdenados[indexAtual - 1];

            const dadosAtuais = processaDadosBi(empresa, `${biAtual.mes.toUpperCase()} / ${biAtual.ano}`);
            const dadosAnteriores = biAnterior ? processaDadosBi(empresa, `${biAnterior.mes.toUpperCase()} / ${biAnterior.ano}`) : null;

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

            setLoading(false);

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

    // Funcao muda ordem dos dados, maior para menor e vice-versa
    const toggleOrdemReceitas = () => {
        setOrdemDecrescenteReceitas((prev) => !prev);
    };
    const toggleOrdemDespesas = () => {
        setOrdemDecrescenteDespesas((prev) => !prev);
    };

    // Transformar os objetos em arrays para os gráficos
    const pieDataReceitas = Object.entries(receitasSubcategorias)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => ordemDecrescenteReceitas ? b.value - a.value : a.value - b.value);
    const pieDataDespesas = Object.entries(despesasSubcategorias)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => ordemDecrescenteDespesas ? b.value - a.value : a.value - b.value);

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

    // Pegando dados para gerar calculos
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
        <LayoutBi empresa={empresa} abaAtiva={abaAtiva} setViewMode={setViewMode}>
            <div className={styles.box_dashboard_bi}>

                <div className={styles.box_filtro_e_resumo}>

                    <div className={styles.box_header_pagina}>
                        <div className={styles.box_descricao_pagina}>
                            {abaAtiva === "resumo" ? <h3>Resumo {capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</h3> : <h3>Demonstrativo de Fluxo de Caixa</h3>}
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
                                        {dashboardData.diferencaPercentualReceita >= 0 ? (
                                            <p>Aumento na receita de {dashboardData.diferencaPercentualReceita.toFixed(2)}% em relação ao mês anterior</p>
                                        ) : (
                                            <p>Redução na receita de {Math.abs(dashboardData.diferencaPercentualReceita).toFixed(2)}% em relação ao mês anterior</p>
                                        )}
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
                                        {dashboardData.diferencaPercentualDespesa >= 0 ? (
                                            <p>Aumento na despesa de {dashboardData.diferencaPercentualDespesa.toFixed(2)}% em relação ao mês anterior</p>
                                        ) : (
                                            <p>Redução na despesa de {Math.abs(dashboardData.diferencaPercentualDespesa).toFixed(2)}% em relação ao mês anterior</p>
                                        )}
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
                                        <p>Resultado Bruto - Despesas Variáveis</p>
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
                                    <p>Ponto de Equilíbrio Operacional</p>
                                    <span>{pontoDeEquilibrioOperacional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            </div>
                            <div className={styles.box_info_mes_anterior}>
                                <div className={styles.infos_mes}>
                                    <div className={styles.descricao_mes_anterior}>
                                        <PiIcons.PiInfo />
                                    </div>
                                    <div className={styles.popup_info_mes}>
                                        <p>Despesa Operacional ÷ Margem de Contribuição</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.box_dados_background}`}>
                            <div className={styles.box_dados}>
                                <span className={`${styles.box_icone_dados} ${styles.icone_equilibrio_financeiro}`}>
                                    <PiIcons.PiCurrencyDollarSimple />
                                </span>
                                <div className={styles.infos_dados}>
                                    <p>Ponto de Equilíbrio Financeiro</p>
                                    <span>{pontoDeEquilibrioFinanceiro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            </div>
                            <div className={styles.box_info_mes_anterior}>
                                <div className={styles.infos_mes}>
                                    <div className={styles.descricao_mes_anterior}>
                                        <PiIcons.PiInfo />
                                    </div>
                                    <div className={styles.popup_info_mes}>
                                        <p>Despesa Operacional + Despesa Financeira ÷ Margem de Contribuição</p>
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
                                                        fill={CoresGraficos[index % CoresGraficos.length]}
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
                                <div className={styles.box_infos_legendas}>
                                    <div className={styles.box_legendas}>
                                        {pieDataReceitas.map((entry) => (
                                            <div key={entry.name} className={styles.legendas} style={{ borderLeft: `1px solid ${CoresGraficos[pieDataReceitas.findIndex(e => e.name === entry.name) % CoresGraficos.length]}` }}>
                                                <div className={styles.box_nome_subcategoria}>
                                                    <div
                                                        className={styles.bolinha}
                                                        style={{ backgroundColor: CoresGraficos[pieDataReceitas.findIndex(e => e.name === entry.name) % CoresGraficos.length] }}
                                                    ></div>
                                                    <span>{entry.name}</span>
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
                                    <div className={styles.box_btn_ordem} onClick={toggleOrdemReceitas}>
                                        {ordemDecrescenteReceitas ? <PiIcons.PiSortAscending /> : <PiIcons.PiSortDescending />}
                                    </div>
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
                                                        fill={CoresGraficos[index % CoresGraficos.length]}
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
                                <div className={styles.box_infos_legendas}>
                                    <div className={styles.box_legendas}>
                                        {pieDataDespesas.map((entry) => (
                                            <div key={entry.name} className={styles.legendas} style={{ borderLeft: `1px solid ${CoresGraficos[pieDataDespesas.findIndex(e => e.name === entry.name) % CoresGraficos.length]}` }}>
                                                <div className={styles.box_nome_subcategoria}>
                                                    <div
                                                        className={styles.bolinha}
                                                        style={{ backgroundColor: CoresGraficos[pieDataDespesas.findIndex(e => e.name === entry.name) % CoresGraficos.length] }}
                                                    ></div>
                                                    <span>{entry.name}</span>
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
                                    <div className={styles.box_btn_ordem} onClick={toggleOrdemDespesas}>
                                        {ordemDecrescenteDespesas ? <PiIcons.PiSortAscending /> : <PiIcons.PiSortDescending />}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>

                ) : (

                    <div className="dreContainer">

                        <div className="box_topo_dre">
                            <h2>Demonstrativo de Fluxo de Caixa</h2>
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
