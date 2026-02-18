import React, { useState, useEffect } from 'react';
import { editarCategoria } from '../../../../services/categorias';

import { Input } from '../../../Input/Input';
import { Button } from '../../../Button/Button';
import { SelectGrupoDre } from '../../../Selects/SelectGrupoDre';

import * as PiIcons from 'react-icons/pi';
import styles from '../../Modal.module.scss';

export const EditarCategoria = ({ trigger, setTrigger, categoria, categoriaEditada, empresaId }) => {

    const [name, setName] = useState('');
    const [tipo, setTipo] = useState('');
    const [grupoDre, setGrupoDre] = useState('NAO_EXIBIR_NO_DRE');
    const [loading, setLoading] = useState(false)

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

        setLoading(true)

        const success = await editarCategoria(name, tipo, categoria, setTrigger, grupoDre, empresaId);

        if (success) {
            setName("");
            setTipo("");
            setTrigger(false);
            setGrupoDre("NAO_EXIBIR_NO_DRE");
            categoriaEditada();
        }

        setLoading(false)

    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Editar Categoria</h3>
                    <span onClick={() => { setTrigger(false); }}>
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
                            <div className={styles.box_select}>
                                <SelectGrupoDre tipo={tipo} grupoDre={grupoDre} setGrupoDre={setGrupoDre} />
                            </div>
                        )}

                        <div className={styles.box_btn_button}>
                            <Button type="submit" loading={loading}>Salvar alterações</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};
