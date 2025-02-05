import React, { useState, useEffect } from 'react';
import { api } from '../../../api/api';
import { toast } from 'sonner';

import { Input } from '../../Input/Input';
import { Button } from '../../Button/Button';

import * as PiIcons from 'react-icons/pi';
import styles from '../Modal.module.scss';

export const EditarSubCategoria = ({ trigger, setTrigger, subcategoria }) => {

    const [name, setName] = useState('');

    // Preencher os estados ao abrir o modal
    useEffect(() => {
        if (subcategoria) {
            setName(subcategoria.name || '');
        }
    }, [subcategoria]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.warning("Insira o nome da subcategoria!")
            return;
        }

        try {

            await api.put(`/subcategorias/${subcategoria.id}`, { name }); // Atualiza a categoria pelo ID
            toast.success("Subcategoria atualizada com sucesso!")
            setTrigger(false);

        } catch (error) {
            toast.error("Erro ao atualizar a categoria!")
        }
    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Editar Subcategoria</h3>
                    <span>
                        <PiIcons.PiXBold
                            className={styles.close}
                            onClick={() => { setTrigger(false); setName('') }}
                        />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                        <Input
                            type="text"
                            placeholder="Nome da subcategoria"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <div className={styles.box_btn_button}>
                            <Button type="submit">Salvar alterações</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};
