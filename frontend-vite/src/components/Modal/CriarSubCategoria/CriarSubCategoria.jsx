import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';

import { Input } from '../../Input/Input';
import { Button } from '../../Button/Button';

import * as PiIcons from 'react-icons/pi';

import styles from '../Modal.module.scss';

export const CriarSubCategoria = ({ trigger, setTrigger, categoria }) => {
    const [categoriaId, setCategoriaId] = useState('');
    const [name, setName] = useState('');

    // Atualiza categoriaId quando a categoria mudar
    useEffect(() => {
        if (categoria?.id) {
            setCategoriaId(categoria.id);
        }
    }, [categoria]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            alert('Por favor, preencha o nome da subcategoria.');
            return;
        }

        if (!categoriaId) {
            alert('Erro: ID da categoria não encontrado.');
            return;
        }

        try {
            const data = {
                name: name,
                categoria_id: categoriaId,
            };

            await api.post('/subcategorias', data);

            setName('');
            setTrigger(false);

        } catch (error) {
            console.error('Erro ao criar subcategoria:', error);
            alert('Erro ao criar subcategoria.');
        }
    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Nova Subcategoria</h3>
                    <span>
                        <PiIcons.PiXBold
                            className={styles.close}
                            onClick={() => {
                                setTrigger(false);
                                setName('');
                            }}
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
                            <Button type="submit">Cadastrar</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};
