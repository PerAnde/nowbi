import React, { useState } from 'react'
import { api } from '../../../services/api'

import { Input } from '../../Input/Input'
import { Button } from '../../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from '../Forms.module.scss'

export const CriarCategoria = (props) => {

    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            alert("Por favor, preencha o nome da empresa.");
            return;
        }

        if (!fotoEmpresa) {
            alert("Por favor, envie uma foto da empresa.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('cnpj_empresa', cnpjEmpresa)

            // Adiciona o arquivo diretamente no formData
            const fileInput = document.getElementById('picture_input');
            if (fileInput.files[0]) {
                formData.append('file', fileInput.files[0]);
            }

            // Envia os dados usando a API
            await api.post('/empresas', formData)
            props.setTrigger(false)

        } catch (error) {
            console.error('Erro ao criar empresa:', error);
            alert('Ocorreu um erro ao criar a empresa.');
        }

    };

    return (props.trigger) ? (

        <div className={styles.popup}>
            <div className={styles.popupNovaEmpresa}>
                <div className={styles.box_btn_fechar}>
                    <h3>Nova Categoria</h3>
                    <span>
                        <PiIcons.PiXBold className={styles.close} onClick={() => { props.setTrigger(false), setName('') }} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                        <Input type="text" placeholder="Nome da empresa" value={name} onChange={(e) => setName(e.target.value)} />

                        <div className={styles.box_btn_button}>
                            <Button type="submit">Cadastrar</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

    ) : "";
}
