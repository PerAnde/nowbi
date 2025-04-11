import React, { useState, useEffect } from 'react';
import { editarCategoria } from '../../../../services/categorias';

import { Input } from '../../../Input/Input';
import { Button } from '../../../Button/Button';

import * as PiIcons from 'react-icons/pi';
import styles from '../../Modal.module.scss';

export const EditarCategoria = ({ trigger, setTrigger, categoria, categoriaEditada }) => {

    const grupoDreReceita = [
        { label: 'Receita Operacional Bruta', value: 'RECEITA_OPERACIONAL_BRUTA' },
        { label: 'Receita Financeira', value: 'RECEITA_FINANCEIRA' },
        { label: 'Outras Receitas', value: 'OUTRAS_RECEITAS' },
    ];

    const grupoDreDespesa = [
        { label: 'Deduções da Receita Bruta', value: 'DEDUCOES_DA_RECEITA_BRUTA' },
        { label: 'Despesas Operacionais', value: 'DESPESAS_OPERACIONAIS' },
        { label: 'Despesas Financeiras', value: 'DESPESAS_FINANCEIRAS' },
        { label: 'Outras Despesas', value: 'OUTRAS_DESPESAS' },
    ];

    const [name, setName] = useState('');
    const [tipo, setTipo] = useState('');
    const [grupoDre, setGrupoDre] = useState('NAO_EXIBIR_NO_DRE');

    // Preencher os estados ao abrir o modal
    useEffect(() => {
        if (categoria) {
            setName(categoria.name || '');
            setTipo(categoria.tipo || '');
            setGrupoDre(categoria.grupoDre || 'NAO_EXIBIR_NO_DRE');
        }
    }, [categoria]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await editarCategoria(name, tipo, categoria, setTrigger, grupoDre);

        if (success) {
            setName("");
            setTipo("");
            setTrigger(false);
            setGrupoDre("NAO_EXIBIR_NO_DRE");
            categoriaEditada();
        }

    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Editar Categoria</h3>
                    <span onClick={() => { setTrigger(false); setName(''); setTipo(''); }}>
                        <PiIcons.PiXBold
                            className={styles.close}
                        />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                        <Input
                            type="text"
                            placeholder="Nome da categoria"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className={styles.box_inputs}>
                            <label htmlFor="receita" className={`${styles.box_input_radio} ${styles.input_receita}`}>
                                <Input
                                    type="radio"
                                    name="tipo"
                                    id="receita"
                                    value="RECEITA"
                                    checked={tipo === "RECEITA"}
                                    onChange={(e) => setTipo(e.target.value)}
                                />
                                <label htmlFor="receita">
                                    <span><PiIcons.PiTrendUpBold /></span> Receita
                                </label>
                            </label>

                            <label htmlFor="despesa" className={`${styles.box_input_radio} ${styles.input_despesa}`}>
                                <Input
                                    type="radio"
                                    name="tipo"
                                    id="despesa"
                                    value="DESPESA"
                                    checked={tipo === "DESPESA"}
                                    onChange={(e) => setTipo(e.target.value)}
                                />
                                <label htmlFor="despesa">
                                    <span><PiIcons.PiTrendDownBold /></span> Despesa
                                </label>
                            </label>
                        </div>

                        {tipo && (
                            <select
                                value={grupoDre}
                                onChange={(e) => setGrupoDre(e.target.value)}
                                className={styles.select}
                            >
                                <option value="NAO_EXIBIR_NO_DRE">Não exibir na DRE</option>
                                {(tipo === 'RECEITA' ? grupoDreReceita : grupoDreDespesa).map((grupo) => (
                                    <option key={grupo.value} value={grupo.value}>{grupo.label}</option>
                                ))}
                            </select>
                        )}

                        <div className={styles.box_btn_button}>
                            <Button type="submit">Salvar alterações</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};
