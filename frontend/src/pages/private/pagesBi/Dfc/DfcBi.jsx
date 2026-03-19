// src/pages/public/DashboardBi/ResumoBi.jsx
import React, { useState, useMemo } from 'react'

import { useBiPublic } from '../../../../contexts/BiPublicContext'
import { api } from '../../../../api/api'

import { InfoResumoBi } from '../../../../components/Modal/InfosResumoBi/InfoResumoBi'
import { FiltroDashboardBi } from '../../../../components/Selects/FiltroDashboardBi'

import { DfcMensal } from './DfcMensal'
import { DfcPeriodo } from './DfcPeriodo'
import { SelectPeriodoDfc } from '../../../../components/Selects/SelectPeriodoDfc'

import { agruparDadosDfcHorizontal } from '../../../../utils/agruparDadosDFCHorizontal'
import { capitalizeFirstLetter } from '../../../../utils/formatUtils'
import { agruparDadosDfc } from '../../../../utils/agruparDadosDFC'
import { salvarDFC } from '../../../../utils/salvarPDF'

import empresaSemLogo from '../../../../assets/images/imgEmpresaSemLogo.jpg'

import stylesMainBi from '../mainBi.module.scss'
import styles from './DfcBi.module.scss'
import * as PiIcons from 'react-icons/pi'

export const DfcBi = () => {

    const {
        empresa,
        mesSelecionado,
        anoSelecionado,
        setMesSelecionado,
        setAnoSelecionado,
        anosDisponiveis,
        loading,
        dashboardData,
    } = useBiPublic()

    const [popUpInfoResumoBi, setPopUpInfoResumoBi] = useState(null)
    const [periodo, setPeriodo] = useState('atual');
    const [abertos, setAbertos] = useState({});

    const dadosHorizontais = useMemo(() => {
        if (periodo !== 'atual' && dashboardData?.dfc12Meses) {
            const limite = periodo === 'atual' ? 1 : parseInt(periodo);
            return agruparDadosDfcHorizontal(dashboardData.dfc12Meses, limite);
        }
        return null;
    }, [periodo, dashboardData]);

    if (loading || !dashboardData) return <p>Carregando...</p>

    const aplicarFiltro = (novoMes, novoAno) => {
        setMesSelecionado(novoMes);
        setAnoSelecionado(novoAno);
        setPeriodo('atual');
    };

    const temAlgoAberto = Object.keys(abertos).length > 0;
    const handleToggleTodos = () => {
        if (temAlgoAberto) {
            setAbertos({});
        } else {
            const novoEstado = {};
            if (periodo !== 'atual') {
                dadosHorizontais.dados.forEach((linha, idx) => {
                    dadosHorizontais.dados.forEach((linha, idx) => {
                        novoEstado[`grupo-${idx}`] = true;
                        Object.keys(linha.categorias || {}).forEach(cat => {
                            novoEstado[`cat-${idx}-${cat}`] = true;
                        });
                    });
                });
            } else {
                dadosFiltrados.forEach((grupo, idx) => {
                    novoEstado[`grupo-${idx}`] = true;
                    Object.keys(grupo.dados.categorias || {}).forEach(cat => {
                        novoEstado[`cat-${idx}-${cat}`] = true;
                    });
                });
            }
            setAbertos(novoEstado);
        }
    };

    const toggleLinha = (id) => {
        setAbertos(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const { summary } = dashboardData

    const dadosFiltrados = agruparDadosDfc(dashboardData.summary.detalhes);

    return (
        <div>

            <div className={stylesMainBi.header_pagina_dashboardBi}>
                <h3>DFC {capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</h3>

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

            <div className={styles.dfcContainer}>

                <div className={styles.controles_tabela}>
                    <div className={styles.box_btns_dfc}>
                        <button onClick={handleToggleTodos} className={styles.btn_expandir_recolher}>
                            {temAlgoAberto ? (
                                <>
                                    <PiIcons.PiMinus /> <span>Recolher Tudo</span>
                                </>
                            ) : (
                                <>
                                    <PiIcons.PiPlus /> <span>Expandir Tudo</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className={styles.box_btns_dfc}>
                        <SelectPeriodoDfc
                            value={periodo}
                            onChange={setPeriodo}
                        />
                        <button onClick={salvarDFC} className={styles.btn_salvar_dfc}>Salvar DFC</button>
                    </div>
                </div>

                <div className="wrapper_dfc">

                    <div className={styles.box_infos_empresa}>
                        <div className={styles.box_logo_empresa}>
                            <img
                                src={empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : empresaSemLogo}
                                alt="Logo Empresa"
                            />
                            <p>Demonstrativo de <br></br>Fluxo de Caixa</p>
                        </div>

                        <div className={styles.box_info_periodo_dfc}>
                            <p>
                                {periodo === 'atual' ? (
                                    <span>{capitalizeFirstLetter(mesSelecionado)}/{anoSelecionado}</span>
                                ) : (
                                    ''
                                )}
                            </p>
                        </div>
                    </div>

                    {periodo === 'atual' ? (
                        <DfcMensal
                            dadosFiltrados={dadosFiltrados}
                            summary={summary}
                            abertos={abertos}
                            toggleLinha={toggleLinha}
                        />
                    ) : (
                        dadosHorizontais && (
                            <DfcPeriodo
                                cabecalho={dadosHorizontais.cabecalho}
                                linhas={dadosHorizontais.dados}
                                abertos={abertos}
                                toggleLinha={toggleLinha}
                            />
                        )
                    )}

                </div>

            </div>

            <InfoResumoBi
                trigger={popUpInfoResumoBi}
                setTrigger={setPopUpInfoResumoBi}
            />

        </div>
    )
}
