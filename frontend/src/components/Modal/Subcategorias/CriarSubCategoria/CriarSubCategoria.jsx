import React, { useState, useEffect } from 'react';
import { criarSubcategoria } from '../../../../services/subcategorias';

import { Input } from '../../../Input/Input';
import { Button } from '../../../Button/Button';

import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss';

export const CriarSubCategoria = ({ trigger, setTrigger, categoria, empresaId, subcategoriaCriada }) => {

    const [categoriaId, setCategoriaId] = useState('');
    const [name, setName] = useState('');

    const [loading, setLoading] = useState(false)

    // Pegando ID da categoria pai
    useEffect(() => {
        if (categoria?.id) {
            setCategoriaId(categoria.id);
        }
    }, [categoria]);


    // Criar subcategoria
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        const success = await criarSubcategoria(name, categoriaId, empresaId)

        if(success){
            setName("");
            setCategoriaId("");
            setTrigger(false);
            subcategoriaCriada();
        }

        setLoading(false)

    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.box_popup}>
                <div className={styles.box_header}>
                    <h3>Nova subcategoria</h3>
                    <span onClick={() => {
                        setTrigger(false);
                        setName('');
                    }}>
                        <PiIcons.PiXBold
                            className={styles.close}
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
                            <Button type="submit" loading={loading}>Cadastrar</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};
