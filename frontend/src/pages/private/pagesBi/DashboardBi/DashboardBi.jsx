import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { buscarDashboardBi } from '../../../../services/dashboardBi';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import styles from './DashboardBi.module.scss';
import './dre.css'
import { LayoutBi } from '../../../../layout/LayoutBi/LayoutBi';
import * as PiIcons from 'react-icons/pi';
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'
import * as XLSX from "xlsx";
import { toast } from 'sonner';

const COLORS = [
    "#3789da", "#37a2da", "#37bcda",
    "#ffa55c", "#ff8a5c", "#ff6f5c",
    "#ffc05c", "#ffdb5c", "#fff35c",
    "#eb6755", "#eb5555", "#eb5587",
    "#9678ea", "#8378ea", "#7880ea",
    "#37cbda", "#37dac2", "#37daa6",
    "#7893ea", "#78a5ea", "#78b8ea",
    "#eb55ab", "#eb55cf", "#d655eb",
]

const processBIData = (empresa, selectedMonth) => {
    const mesesAtivos = empresa.bis.filter(bi => bi.status);
    const result = {};
    let totalReceitas = 0;
    let totalDespesas = 0;
    const categorias = {};
    const subcategorias = {};
    const detalhes = [];

    mesesAtivos.forEach(({ mes, ano, lancamentoBi }) => {
        const mesAnoAtual = `${mes} / ${ano}`; // Formato compatível com selectedMonth

        if (selectedMonth && mesAnoAtual !== selectedMonth) return; // Comparação correta

        if (!result[mesAnoAtual]) {
            result[mesAnoAtual] = { receitas: 0, despesas: 0 };
        }

        lancamentoBi.forEach(({ valor, tipo, categoria, subcategoria }) => {
            const valorNum = parseFloat(valor);
            detalhes.push({ mes: mesAnoAtual, tipo, valor: valorNum, categoria: categoria?.name, subcategoria: subcategoria?.name });

            if (tipo === "RECEITA") {
                result[mesAnoAtual].receitas += valorNum;
                totalReceitas += valorNum;
            } else if (tipo === "DESPESA") {
                result[mesAnoAtual].despesas += valorNum;
                totalDespesas += valorNum;
            }

            if (categoria) {
                categorias[categoria.name] = (categorias[categoria.name] || 0) + valorNum;
            }

            if (subcategoria) {
                subcategorias[subcategoria.name] = (subcategorias[subcategoria.name] || 0) + valorNum;
            }
        });
    });

    return { result, summary: { receitas: totalReceitas, despesas: totalDespesas, categorias, subcategorias, detalhes } };
};

export const DashboardBi = () => {

    const { link_bi } = useParams();
    const [empresa, setEmpresa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("");
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

        const mesesAtivosOrdenados = empresa.bis
            .filter(bi => bi.status)
            .sort((a, b) => a.ano - b.ano || monthOrder[a.mes.toLowerCase()].num - monthOrder[b.mes.toLowerCase()].num);

        if (mesesAtivosOrdenados.length > 0) {
            const ultimoMes = mesesAtivosOrdenados[mesesAtivosOrdenados.length - 1];
            const mesAnoUltimo = `${ultimoMes.mes} / ${ultimoMes.ano}`;

            setSelectedMonth(mesAnoUltimo); // Agora setamos o mês antes de processar os dados
        }
    }, [empresa]);

    useEffect(() => {
        if (empresa && selectedMonth) {
            const processedData = processBIData(empresa, selectedMonth);
            setDashboardData(processedData);
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
                month: `${monthOrder[mes.toLowerCase()].abbr}/${String(ano).slice(-2)}`, // Formato "Abr/24"
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
    const margemLucro = (lucroBruto / summary.receitas) * 100 || 0;

    const custos = Object.entries(despesasAgrupadas).find(
        ([categoria]) => categoria.toLowerCase() === "custos"
    )?.[1]?.total || 0;

    const despesasOrdenadas = Object.entries(despesasAgrupadas).sort(([catA], [catB]) => {
        if (catA.toLowerCase() === "despesas financeiras") return 1; // Move "Despesas Financeiras" para o final
        if (catB.toLowerCase() === "despesas financeiras") return -1;
        return 0;
    });

    // Exportar Excel
    const exportarParaExcel = () => {

        toast.info("Gerando arquivo em Excel aguarde!")

        const dados = [
            ["Demonstração do Resultado do Exercício (DRE)"],
            [],
            ["Descrição", "Total", "Análise Vertical"],

            // Receita Bruta
            ["Receita Bruta"],
            ...Object.entries(receitasAgrupadas).flatMap(([categoria, dados]) => [
                [categoria, dados.total, ((dados.total / summary.receitas) * 100).toFixed(2) + "%"],
                ...Object.entries(dados.subcategorias).map(([sub, valor]) => [
                    `  ↳ ${sub}`,
                    valor,
                    ((valor / summary.receitas) * 100).toFixed(2) + "%"
                ])
            ]),

            // Deduções e Impostos
            ["Deduções e Impostos (-)"],
            ...Object.entries(despesasAgrupadas)
                .filter(([categoria]) => categoria.toLowerCase() === "impostos")
                .flatMap(([categoria, dados]) => [
                    [categoria, dados.total, ((dados.total / summary.receitas) * 100).toFixed(2) + "%"],
                    ...Object.entries(dados.subcategorias).map(([sub, valor]) => [
                        `  ↳ ${sub}`,
                        valor,
                        ((valor / summary.receitas) * 100).toFixed(2) + "%"
                    ])
                ]),
            [],

            // Receita Operacional Líquida
            ["Receita Operacional Líquida", summary.receitas],
            [],

            // Custos Variáveis
            ["Custo Variável (CPV ou CMV)"],
            ...Object.entries(despesasAgrupadas)
                .filter(([categoria]) => categoria.toLowerCase() === "custos")
                .flatMap(([categoria, dados]) => [
                    [categoria, dados.total, ((dados.total / summary.receitas) * 100).toFixed(2) + "%"],
                    ...Object.entries(dados.subcategorias).map(([sub, valor]) => [
                        `  ↳ ${sub}`,
                        valor,
                        ((valor / summary.receitas) * 100).toFixed(2) + "%"
                    ])
                ]),

            // Resultado Bruto
            ["Resultado Bruto", summary.receitas - custos],
            [],

            // Despesas Operacionais
            ["Despesas Operacionais (-)"],
            ...despesasOrdenadas
                .filter(([categoria]) => categoria.toLowerCase() !== "impostos" && categoria.toLowerCase() !== "custos")
                .flatMap(([categoria, dados]) => [
                    [categoria, dados.total, ((dados.total / summary.receitas) * 100).toFixed(2) + "%"],
                    ...Object.entries(dados.subcategorias).map(([sub, valor]) => [
                        `  ↳ ${sub}`,
                        valor,
                        ((valor / summary.receitas) * 100).toFixed(2) + "%"
                    ])
                ]),

            // Lucro/Prejuízo Operacional
            ["Lucro/Prejuízo Operacional", lucroBruto],
            [],

            // Outras Receitas/Despesas
            ["Outras Receitas/Despesas"],
            [],

            // Resultado Antes do IR e CSLL
            ["Resultado Antes do IR e CSLL", lucroBruto],
            [],

            // Lucro/Prejuízo Acumulado
            ["Lucro/Prejuízo Acumulado", lucroBruto, ((lucroBruto / summary.receitas) * 100).toFixed(2) + "%"]
        ];

        const ws = XLSX.utils.aoa_to_sheet(dados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DRE");

        XLSX.writeFile(wb, "dre.xlsx");
    };

    const salvarDRE = () => {
        const dreContainer = document.querySelector(".box_resultados_dre");

        if (!dreContainer) return;

        const novaAba = window.open("", "_blank");

        // Pega todas as folhas de estilo da página atual
        const styles = Array.from(document.styleSheets)
            .map((sheet) => {
                try {
                    return Array.from(sheet.cssRules)
                        .map(rule => rule.cssText)
                        .join("\n");
                } catch (e) {
                    return "";
                }
            })
            .join("\n");

        novaAba.document.write(`
            <html>
                <head>
                    <title>DRE</title>
                    <style>${styles}</style>
                </head>
                <body>
                    ${dreContainer.outerHTML}
                </body>
            </html>
        `);

        novaAba.document.close();
        novaAba.focus();

        setTimeout(() => {
            novaAba.print();
        }, 500);
    };

    return (
        <LayoutBi>
            <div className={styles.box_dashboard_bi}>

                <div className={styles.box_menu_btns}>
                    <Link className={abaAtiva === "resumo" ? styles.active : ""} onClick={() => setViewMode("resumo")}><PiIcons.PiChartBar /> Resumo</Link>
                    <Link className={abaAtiva === "detalhes" ? styles.active : ""} onClick={() => setViewMode("detalhes")}><PiIcons.PiFilePdfThin /> DRE</Link>
                </div>

                <div className={styles.box_filtro_e_resumo}>
                    <div className={styles.box_filtro_mes}>
                        <label>Selecione o mês:</label>
                        <select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
                            {empresa.bis
                                .filter(bi => bi.status)
                                .sort((a, b) => a.ano - b.ano || monthOrder[a.mes.toLowerCase()].num - monthOrder[b.mes.toLowerCase()].num)
                                .map(bi => {
                                    const mesAno = `${bi.mes} / ${bi.ano}`;
                                    return (
                                        <option key={mesAno} value={mesAno}>
                                            {capitalizeFirstLetter(bi.mes)} / {bi.ano}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>

                    <div className={styles.box_infos_resumo}>
                        <div className={`${styles.box_dados} ${styles.ativo}`}>
                            <span className={`${styles.box_icone_dados} ${styles.icone_receita}`}>
                                <PiIcons.PiArrowUpRightBold />
                            </span>
                            <div className={styles.infos_dados}>
                                <p>Receitas</p>
                                <span>{summary.receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        </div>
                        <div className={`${styles.box_dados}`}>
                            <span className={`${styles.box_icone_dados} ${styles.icone_despesa}`}>
                                <PiIcons.PiArrowDownRightBold />
                            </span>
                            <div className={styles.infos_dados}>
                                <p>Despesas</p>
                                <span>{summary.despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        </div>
                        <div className={`${styles.box_dados}`}>
                            <span className={`${styles.box_icone_dados} ${styles.icone_equilibrio}`}>
                                <PiIcons.PiScales />
                            </span>
                            <div className={styles.infos_dados}>
                                <p>Ponto de Equilíbrio</p>
                                <span>R$ 10.000,00</span>
                            </div>
                        </div>
                        <div className={`${styles.box_dados}`}>
                            <span className={`${styles.box_icone_dados} ${styles.icone_margem}`}>
                                <PiIcons.PiChartPieSlice />
                            </span>
                            <div className={styles.infos_dados}>
                                <p>Margem de Contribuição</p>
                                <span>R$ 2.000,00</span>
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
                                        contentStyle={{ background: "var(--branco)", color: "var(--texto-secundario)", borderRadius: "8px", border: '1px solid var(--texto-secundario)' }} />
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
                                            color: "var(--texto-secundario)",
                                            fontSize: "1.4rem",
                                        }}
                                    />
                                    <Bar dataKey="receitas" fill="#3789da" name="Receitas" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="despesas" fill="#eb5555" name="Despesas" radius={[8, 8, 0, 0]} />
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

                                            <Tooltip formatter={(value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
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
                                            <Tooltip formatter={(value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
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
                                <button onClick={exportarParaExcel}>Exportar .XLS</button>
                                <button onClick={salvarDRE}>Salvar PDF</button>
                            </div>
                        </div>

                        <div className="wrapper_dre">

                            <div className="box_resultados_dre">

                                <div className="box_header_dre">

                                    <div className="header_dados_dre">
                                        <p><strong>Descrição</strong></p>
                                        <p><strong>Total</strong></p>
                                        <p><strong>Análise Vertical</strong></p>
                                    </div>

                                </div>


                                {/* /* Receita Bruta */}
                                <div className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <strong>Receita Bruta</strong>
                                    </div>
                                    {Object.entries(receitasAgrupadas).map(([categoria, dados]) => (
                                        <React.Fragment key={categoria}>
                                            <div className="box_categorias_dre">
                                                <div>{categoria}</div>
                                                <div>{dados.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                                <div>{((dados.total / summary.receitas) * 100).toFixed(2)}%</div>
                                            </div>
                                            {Object.entries(dados.subcategorias).map(([sub, valor]) => (
                                                <div key={sub} className="box_subcategorias_dre">
                                                    <div className="nome_subcategoria"><PiIcons.PiArrowElbowDownRight className="icone_subcategoria_dre" /> <p>{sub}</p></div>
                                                    <div>{valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                                    <div>{((valor / summary.receitas) * 100).toFixed(2)}%</div>
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {/* Deduções e Impostos */}
                                <div className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <strong>Deduções e Impostos (-)</strong>
                                    </div>
                                    {Object.entries(despesasAgrupadas).map(([categoria, dados]) =>
                                        categoria.toLowerCase() === "impostos" && (
                                            <React.Fragment key={categoria}>
                                                <div className="box_categorias_dre">
                                                    <div>{categoria}</div>
                                                    <div>{dados.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                                    <div>{((dados.total / summary.receitas) * 100).toFixed(2)}%</div>
                                                </div>
                                                {Object.entries(dados.subcategorias).map(([sub, valor]) => (
                                                    <div key={sub} className="box_subcategorias_dre">
                                                        <div className="nome_subcategoria"><PiIcons.PiArrowElbowDownRight className="icone_subcategoria_dre" /> <p>{sub}</p></div>
                                                        <div>{valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                                        {/* <div>{((valor / summary.receitas) * 100).toFixed(2)}%</div> */}
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                </div>

                                {/* Receita Líquida */}
                                <div className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <strong>Receita Operacional Líquida</strong>
                                        <strong>{summary.receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                    </div>
                                </div>

                                {/* Custo Variável (CPV ou CMV) */}
                                <div className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <strong>Custo Variável (CPV ou CMV)</strong>
                                    </div>
                                    {Object.entries(despesasAgrupadas).map(([categoria, dados]) =>
                                        categoria.toLowerCase() === "custos" && (
                                            <React.Fragment key={categoria}>
                                                <div className="box_categorias_dre">
                                                    <div>{categoria}</div>
                                                    <div>{dados.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                                    <div>{((dados.total / summary.receitas) * 100).toFixed(2)}%</div>
                                                </div>
                                                {Object.entries(dados.subcategorias).map(([sub, valor]) => (
                                                    <div key={sub} className="box_subcategorias_dre">
                                                        <div className="nome_subcategoria"><PiIcons.PiArrowElbowDownRight className="icone_subcategoria_dre" /> <p>{sub}</p></div>
                                                        <div>{valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        ))}

                                </div>

                                {/* Resultado bruto */}
                                <div className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <strong>Resultado Bruto</strong>
                                        <strong>{(summary.receitas - custos).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                    </div>
                                </div>

                                {/* Despesas Operacionais */}
                                <div className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <strong>Despesas Operacionais (-)</strong>
                                        <strong>{(summary.receitas - custos).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                    </div>
                                </div>

                                {/* /* Despesas Variáveis */}
                                <div className="resultado_dre">
                                    {despesasOrdenadas.map(([categoria, dados]) =>
                                        categoria.toLowerCase() !== "impostos" && categoria.toLowerCase() !== "custos" && (
                                            <React.Fragment key={categoria}>
                                                <div className="box_categorias_dre">
                                                    <div>{categoria}</div>
                                                    <div>{dados.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                                    <div>{((dados.total / summary.receitas) * 100).toFixed(2)}%</div>
                                                </div>
                                                {Object.entries(dados.subcategorias).map(([sub, valor]) => (
                                                    <div key={sub} className="box_subcategorias_dre">
                                                        <div className="nome_subcategoria"><PiIcons.PiArrowElbowDownRight className="icone_subcategoria_dre" /> <p>{sub}</p></div>
                                                        <div>{valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                                        <div>{((valor / summary.receitas) * 100).toFixed(2)}%</div>
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        ))}

                                </div>

                                {/* Lucro/Prejuízo Operacional */}
                                <div className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <strong>Lucro/Prejuízo Operacional</strong>
                                        <strong>{lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                    </div>
                                </div>

                                {/* Outras Receitas/Despesas */}
                                <div className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <strong>Outras Receitas/Despesas</strong>
                                    </div>
                                </div>

                                {/* Resultado Antes do IR e CSLL */}
                                <div className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <strong>Resultado Antes do IR e CSLL</strong>
                                        <strong>{lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                    </div>
                                </div>

                                {/* Lucro/Prejuízo Acumulado */}
                                <div className="resultado_dre">
                                    <div className="header_info_resultado">
                                        <strong>Lucro/Prejuízo Acumulado</strong>
                                        <strong>{lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                        <strong>{((lucroBruto / summary.receitas) * 100).toFixed(2)}%</strong>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                )}

            </div>
        </LayoutBi >
    );
};
