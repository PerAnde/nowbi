import React, { useState, useEffect } from 'react';
import { editarSubcategoria } from '../../../../services/subcategorias';
import { toast } from 'sonner';

import { Input } from '../../../Input/Input';
import { Button } from '../../../Button/Button';

import * as PiIcons from 'react-icons/pi';
import styles from '../../Modal.module.scss';

export const EditarSubCategoria = ({ trigger, setTrigger, subcategoria, empresaId, subcategoriaEditada }) => {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false)

    // Preencher os estados ao abrir o modal
    useEffect(() => {
        if (subcategoria) {
            setName(subcategoria.name || '');
        }
    }, [subcategoria]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        const success = await editarSubcategoria(name, subcategoria, empresaId, setTrigger);

        if (success) {
            setName("");
            setTrigger(false);
            subcategoriaEditada();
        }

        setLoading(false)

    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.box_popup}>
                <div className={styles.box_header}>
                    <h3>Editar subcategoria</h3>
                    <span>
                        <PiIcons.PiXBold
                            className={styles.close}
                            onClick={() => { setTrigger(false); setName('') }}
                        />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.box_form}>
                    <div className={styles.box_infos}>
                        <Input
                            type="text"
                            placeholder="Nome da subcategoria"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <div className={styles.box_btn_button}>
                            <Button type="submit" loading={loading}>Salvar alterações</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};
