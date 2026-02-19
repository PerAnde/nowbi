import React, { useState, useEffect } from 'react';
import { Button } from '../../../Button/Button';
import * as PiIcons from 'react-icons/pi';
import styles from './ConfigEmpresa.module.scss';

import { atualizarConfigDashboardBI } from '../../../../services/empresas';

export const ConfigEmpresa = ({ trigger, setTrigger, empresa }) => {
    const [loading, setLoading] = useState(false);

    const [config, setConfig] = useState({
        mostrar_resumo: false,
        mostrar_detalhes: false,
        mostrar_dfc: false,
        // mostrar_dre: false,
        mostrar_relatorio: false,
    });

    useEffect(() => {
        if (empresa) {
            setConfig({
                mostrar_resumo: empresa.mostrar_resumo,
                mostrar_detalhes: empresa.mostrar_detalhes,
                mostrar_dfc: empresa.mostrar_dfc,
                // mostrar_dre: empresa.mostrar_dre,
                mostrar_relatorio: empresa.mostrar_relatorio,
            });
        }
    }, [empresa, trigger]);

    const toggleConfig = (campo) => {
        setConfig(prev => ({
            ...prev,
            [campo]: !prev[campo]
        }));
    };

    const salvarConfiguracoes = async () => {
        setLoading(true);

        const sucesso = await atualizarConfigDashboardBI(empresa.id, config);

        if (sucesso) {
            setTrigger(false); // fecha o modal
        }

        setLoading(false);
    };


    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Configurações</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <div className={styles.box_observacoes}>
                    <p>Escolha quais páginas do Dashboard BI serão exibidas.</p>
                </div>

                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={config.mostrar_resumo}
                        onChange={() => toggleConfig('mostrar_resumo')}
                    />
                    <span className={styles.slider}></span>
                    <span className={styles.label}>Página Resumo</span>
                </label>

                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={config.mostrar_detalhes}
                        onChange={() => toggleConfig('mostrar_detalhes')}
                    />
                    <span className={styles.slider}></span>
                    <span className={styles.label}>Página Detalhes</span>
                </label>

                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={config.mostrar_dfc}
                        onChange={() => toggleConfig('mostrar_dfc')}
                    />
                    <span className={styles.slider}></span>
                    <span className={styles.label}>Página DFC</span>
                </label>

                {/* 
                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={config.mostrar_dre}
                        onChange={() => toggleConfig('mostrar_dre')}
                    />
                    <span className={styles.slider}></span>
                    <span className={styles.label}>Página DRE</span>
                </label> */}

                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={config.mostrar_relatorio}
                        onChange={() => toggleConfig('mostrar_relatorio')}
                    />
                    <span className={styles.slider}></span>
                    <span className={styles.label}>Página Relatório</span>
                </label>

                <div className={styles.box_btn_button}>
                    <Button onClick={salvarConfiguracoes} type="submit" loading={loading}>Salvar alterações</Button>
                </div>
            </div>
        </div>
    ) : null;
};
