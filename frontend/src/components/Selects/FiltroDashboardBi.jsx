import React, { useState, useMemo, useEffect } from 'react';
import { SelectMesBi } from './SelectMesBi';
import { SelectAnoBi } from './SelectAnoBi';
import styles from './FiltroDashboardBi.module.scss'

const monthOrder = {
    "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4, "maio": 5, "junho": 6,
    "julho": 7, "agosto": 8, "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12
};

export const FiltroDashboardBi = ({
    empresa,
    mesAtivo,
    anoAtivo,
    anosDisponiveis,
    onAplicar
}) => {
    // Estados locais (Temporários)
    const [anoTemp, setAnoTemp] = useState(anoAtivo);
    const [mesTemp, setMesTemp] = useState(mesAtivo);

    // 1. Lógica de Meses: Sempre "olha" para o anoTemp
    const mesesParaExibir = useMemo(() => {
        if (!empresa?.bis) return [];

        return empresa.bis
            .filter(bi => bi.status && String(bi.ano) === String(anoTemp))
            .map(bi => bi.mes.toLowerCase())
            .sort((a, b) => (monthOrder[a] || 0) - (monthOrder[b] || 0));
    }, [empresa, anoTemp]);

    // 2. Auto-ajuste: Se o ano mudar e o mês atual não existir, pega o primeiro do novo ano
    useEffect(() => {
        if (mesesParaExibir.length > 0) {
            const aindaValido = mesesParaExibir.includes(mesTemp.toLowerCase());
            if (!aindaValido) {
                setMesTemp(mesesParaExibir[0]);
            }
        }
    }, [anoTemp, mesesParaExibir]);

    // 3. Sincronização: Se o dashboard mudar externamente (ex: carregamento inicial)
    useEffect(() => {
        setAnoTemp(anoAtivo);
        setMesTemp(mesAtivo);
    }, [anoAtivo, mesAtivo]);

    return (
        <div className={styles.box_filtros_mes_ano}>
            <div className={styles.mes_ano}>
                <SelectAnoBi
                    anoSelecionado={anoTemp}
                    setAnoSelecionado={setAnoTemp}
                    anosDisponiveis={anosDisponiveis}
                />
                <SelectMesBi
                    key={`mes-for-${anoTemp}`}
                    mesSelecionado={mesTemp}
                    setMesSelecionado={setMesTemp}
                    mesesDisponiveis={mesesParaExibir}
                />
            </div>

            <div className={styles.box_btn_filtro}>
                <button onClick={() => onAplicar(mesTemp, anoTemp)}>
                    Filtrar
                </button>
            </div>
        </div>
    );
};