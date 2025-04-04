import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { buscarDashboardBi } from '../../../../services/dashboardBi';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import styles from './DashboardBi.module.scss';
import { LayoutBi } from '../../../../layout/LayoutBi/LayoutBi';
import * as PiIcons from 'react-icons/pi';
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'

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
    const [viewMode, setViewMode] = useState("resumo");
    const navigate = useNavigate();

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
                month: `${monthOrder[mes.toLowerCase()].abbr} / ${ano}`, // Formato "Abr / 2024"
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


    return (
        <LayoutBi>
            <div className={styles.resumo_bi}>
                <div className={styles.box_menu_btns}>
                    <Link className={viewMode === "resumo" ? styles.active : ""} onClick={() => setViewMode("resumo")}>Resumo</Link>
                    <Link className={viewMode === "detalhes" ? styles.active : ""} onClick={() => setViewMode("detalhes")}>DRE</Link>
                </div>
                <div className={styles.box_filtro_mes}>
                    <label>Filtrar:</label>
                    <select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
                        {empresa.bis
                            .filter(bi => bi.status)
                            .sort((a, b) => a.ano - b.ano || monthOrder[a.mes.toLowerCase()].num - monthOrder[b.mes.toLowerCase()].num) // Ordenação correta
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
                    <div className={`${styles.box_dados} ${styles.box_receita} ${styles.ativo}`}>
                        <span className={`${styles.box_icone_dados} ${styles.icone_receita}`}>
                            <PiIcons.PiArrowUpRightBold />
                        </span>
                        <div className={styles.infos_dados}>
                            <p>Receitas</p>
                            <span>{summary.receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>
                    <div className={`${styles.box_dados} ${styles.box_despesa}`}>
                        <span className={`${styles.box_icone_dados} ${styles.icone_despesa}`}>
                            <PiIcons.PiArrowDownRightBold />
                        </span>
                        <div className={styles.infos_dados}>
                            <p>Despesas</p>
                            <span>{summary.despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>


                </div>
                {viewMode === "resumo" ? (
                    <div className={styles.box_resumo}>

                        <div className={styles.box_grafico_anual}>
                            <h3>Últimos 12 meses</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="month" stroke="var(--texto-secundario)" />
                                    <YAxis stroke="var(--texto-secundario)" />
                                    <Tooltip
                                        formatter={(value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        contentStyle={{ background: "var(--branco)", color: "var(--cinza)", borderRadius: "8px", border: '1px solid var(--texto-secundario)' }} />
                                    <Legend />
                                    <Bar dataKey="receitas" fill="#3789da" name="Receitas" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="despesas" fill="#eb5555" name="Despesas" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={styles.chart_container}>

                            <div className={styles.box_graficos_donnut}>
                                <ResponsiveContainer width={350} height={350}>
                                    <h3>Receitas</h3>
                                    <PieChart>
                                        <Pie
                                            data={pieDataReceitas}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={85}
                                            outerRadius={150}
                                            startAngle={90}
                                            endAngle={-270}
                                            stroke="none"
                                        >
                                            {pieDataReceitas.map((entry, index) => (
                                                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>

                                        <Tooltip formatter={(value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className={styles.custom_legend}>
                                    {pieDataReceitas.map((entry) => (
                                        <div key={entry.name} className={styles.legend_item}>
                                            <span
                                                className={styles.color_box}
                                                style={{ backgroundColor: COLORS[pieDataReceitas.findIndex(e => e.name === entry.name) % COLORS.length] }}
                                            ></span>
                                            <span>{entry.name}</span>
                                            <span className={styles.valor}>{entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                            <span className={styles.item_percentual}>{((entry.value / summary.receitas) * 100).toFixed(2)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.box_graficos_donnut}>
                                <ResponsiveContainer width={350} height={350}>
                                    <h3>Despesas</h3>
                                    <PieChart>
                                        <Pie
                                            data={pieDataDespesas}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={85}
                                            outerRadius={150}
                                            startAngle={90}
                                            endAngle={-270}
                                            stroke="none"
                                        >
                                            {pieDataDespesas.map((entry, index) => (
                                                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className={styles.custom_legend}>
                                    {pieDataDespesas.map((entry) => (
                                        <div key={entry.name} className={styles.legend_item}>
                                            <span
                                                className={styles.color_box}
                                                style={{ backgroundColor: COLORS[pieDataDespesas.findIndex(e => e.name === entry.name) % COLORS.length] }}
                                            ></span>
                                            <span>{entry.name}</span>
                                            <span className={styles.valor}>{entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                            <span className={styles.item_percentual}>{((entry.value / summary.receitas) * 100).toFixed(2)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                ) : (
                    <div className={styles.dreContainer}>
                        <h3>Demonstração do Resultado do Exercício (DRE)</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Categoria</th>
                                    <th>Subcategoria</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Receitas */}
                                <tr className={styles.sectionHeader}><td colSpan="3">Receitas</td></tr>
                                {Object.entries(receitasAgrupadas).map(([categoria, dados]) => (
                                    <React.Fragment key={categoria}>
                                        <tr className={styles.categoriaRow}>
                                            <td>{categoria}</td>
                                            <td>-</td>
                                            <td>{dados.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        </tr>
                                        {Object.entries(dados.subcategorias).map(([sub, valor]) => (
                                            <tr key={sub} className={styles.subcategoriaRow}>
                                                <td></td>
                                                <td>{sub}</td>
                                                <td>{valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}

                                {/* Despesas */}
                                <tr className={styles.sectionHeader}><td colSpan="3">Despesas</td></tr>
                                {Object.entries(despesasAgrupadas).map(([categoria, dados]) => (
                                    <React.Fragment key={categoria}>
                                        <tr className={styles.categoriaRow}>
                                            <td>{categoria}</td>
                                            <td>-</td>
                                            <td>-{dados.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        </tr>
                                        {Object.entries(dados.subcategorias).map(([sub, valor]) => (
                                            <tr key={sub} className={styles.subcategoriaRow}>
                                                <td></td>
                                                <td>{sub}</td>
                                                <td>-{valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}

                                {/* Lucro */}
                                <tr className={styles.lucroRow}>
                                    <td>Lucro Bruto</td>
                                    <td>-</td>
                                    <td>{lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                </tr>
                                <tr className={styles.lucroRow}>
                                    <td>Lucro/Prejuizo Acumualdo</td>
                                    <td></td>
                                    <td>{margemLucro.toFixed(2)}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </LayoutBi >
    );
};
