import React, { useState, useEffect } from 'react';
import { api } from '../../../api/api';
import { toast } from 'sonner';

import { Input } from '../../Input/Input';
import { Button } from '../../Button/Button';

import * as PiIcons from 'react-icons/pi';
import styles from '../Modal.module.scss';

export const EditarCategoria = ({ trigger, setTrigger, categoria }) => {

    const [name, setName] = useState('');
    const [tipo, setTipo] = useState('');

    // Preencher os estados ao abrir o modal
    useEffect(() => {
        if (categoria) {
            setName(categoria.name || '');
            setTipo(categoria.tipo || '');
        }
    }, [categoria]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.warning("Preencha o nome da categoria!")
            return;
        }

        if (!tipo) {
            toast.warning("Selecione RECEITA ou DESPESA")
            return;
        }

        try {
            const data = { name, tipo };

            await api.put(`/categorias/${categoria.id}`, data); // Atualiza a categoria pelo ID
            toast.success("Categoria atualizada com sucesso!")

            setTrigger(false);
        } catch (error) {
            toast.error("Erro ao atualizar a categoria!")
        }
    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Editar Categoria</h3>
                    <span>
                        <PiIcons.PiXBold
                            className={styles.close}
                            onClick={() => { setTrigger(false); setName(''); setTipo(''); }}
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

                        <div className={styles.box_btn_button}>
                            <Button type="submit">Salvar alterações</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};
