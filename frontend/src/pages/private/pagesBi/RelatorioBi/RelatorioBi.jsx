import React, { useState, useEffect } from 'react'

import { useBiPublic } from '../../../../contexts/BiPublicContext'
import { SelectMesBi } from '../../../../components/Selects/SelectMesBi'
import { SelectAnoBi } from '../../../../components/Selects/SelectAnoBi'
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'
import { api } from '../../../../api/api'
import { salvarRelatorio } from '../../../../utils/salvarPDF'

import styles from './RelatorioBi.module.scss'

export const RelatorioBi = () => {

    const {
        empresa,
        mesSelecionado,
        anoSelecionado,
        setMesSelecionado,
        setAnoSelecionado,
        mesesDisponiveis,
        anosDisponiveis,
    } = useBiPublic()

    const [mesTemp, setMesTemp] = useState(mesSelecionado);
    const [anoTemp, setAnoTemp] = useState(anoSelecionado);

    useEffect(() => {
        if (!empresa || !mesSelecionado || !anoSelecionado) return;

        setMesTemp(mesSelecionado);
        setAnoTemp(anoSelecionado);

    }, [empresa, mesSelecionado, anoSelecionado]);

    const aplicarFiltro = () => {
        if (!empresa) return;

        const biExiste = empresa.bis.some(bi =>
            bi.status &&
            bi.mes.toLowerCase() === mesTemp.toLowerCase() &&
            Number(bi.ano) === Number(anoTemp)
        );

        if (!biExiste) {
            alert(`Não há BI lançado para ${capitalizeFirstLetter(mesTemp)}/${anoTemp}.`);
            return;
        }

        setMesSelecionado(mesTemp);
        setAnoSelecionado(anoTemp);
    };

    const biAtual = empresa?.bis?.find(bi =>
        bi.mes.toLowerCase() === mesSelecionado.toLowerCase() &&
        Number(bi.ano) === Number(anoSelecionado)
    );

    const dadosRelatorio = biAtual?.observacoes?.[0];

    const relatorioVazio = (html) => {
        if (!html) return false;
        const textoLimpo = html.replace(/<[^>]*>/g, '').trim();
        return textoLimpo.length > 0;
    };

    return (
        <div className={styles.box_dashboard_bi}>

            <div className={styles.header_pagina_dashboardBi}>
                <h3>Detalhes {capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</h3>

                <div className={styles.filtros_mes_ano}>
                    <div className={styles.mes_ano}>
                        <SelectMesBi mesSelecionado={mesTemp} setMesSelecionado={setMesTemp} mesesDisponiveis={mesesDisponiveis} />
                        <SelectAnoBi anoSelecionado={anoTemp} setAnoSelecionado={setAnoTemp} anosDisponiveis={anosDisponiveis} />
                    </div>
                    <div className={styles.box_btn_filtro}>
                        <button onClick={aplicarFiltro}>Filtrar</button>
                    </div>
                </div>
            </div>


            <div className={styles.box_topo_dre}>
                <div className={styles.box_btns_salvar}>
                    <button onClick={salvarRelatorio}>Salvar Relatório</button>
                </div>
            </div>

            <div className={styles.box_pagina_bi}>
                {relatorioVazio(dadosRelatorio?.periodo_mes) &&
                    relatorioVazio(dadosRelatorio?.resumo_geral) &&
                    relatorioVazio(dadosRelatorio?.analise_receita) &&
                    relatorioVazio(dadosRelatorio?.analise_despesa) &&
                    relatorioVazio(dadosRelatorio?.pontos_atencao) &&
                    relatorioVazio(dadosRelatorio?.recomendacoes) &&
                    relatorioVazio(dadosRelatorio?.conclusao) ? (
                    <div className='box_gerar_relatorio'>
                        <div className={styles.box_relatorio}>
                            <div className="box_logo_empresa">
                                <img
                                    src={empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : empresaSemLogo}
                                    alt="Logo Empresa"
                                />
                                <div dangerouslySetInnerHTML={{ __html: dadosRelatorio.periodo_mes }} />
                            </div>

                            <section className={styles.box_resumo_geral}>
                                <div className={styles.header_section}>
                                    <h4>Resumo Geral</h4>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: dadosRelatorio.resumo_geral }} />
                            </section>

                            <section className={styles.box_receitas}>
                                <div className={styles.header_section}>
                                    <h4>Análise de Receitas</h4>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: dadosRelatorio.analise_receita }} />
                            </section>

                            <section className={styles.box_despesas}>
                                <div className={styles.header_section}>
                                    <h4>Análise de Despesas</h4>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: dadosRelatorio.analise_despesa }} />
                            </section>

                            <section className={styles.box_pontos_atencao}>
                                <div className={styles.header_section}>
                                    <h4>Pontos de Atenção</h4>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: dadosRelatorio.pontos_atencao }} />
                            </section>

                            <section className={styles.box_recomendacoes}>
                                <div className={styles.header_section}>
                                    <h4>Recomendações</h4>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: dadosRelatorio.recomendacoes }} />
                            </section>

                            <section className={styles.box_conclusao}>
                                <div className={styles.header_section}>
                                    <h4>Conclusão</h4>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: dadosRelatorio.conclusao }} />
                            </section>
                        </div>
                    </div>
                ) : (
                    <div className={styles.no_data}>
                        <p>Nenhuma análise detalhada disponível para {mesSelecionado}/{anoSelecionado}.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
