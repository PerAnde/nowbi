import React, { useState } from 'react'
import { api } from '../../services/api'

import { Input } from '../Input/Input'
import { Button } from '../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from './CriarEmpresa.module.scss'

export const CriarEmpresa = (props) => {

    // Preview da imagem enviada
    const [fotoEmpresa, setFotoEmpresa] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFotoEmpresa(e.target.result); // Atualiza o estado com o URL da imagem
            };
            reader.readAsDataURL(file);
        } else {
            setFotoEmpresa(null); // Reseta caso nenhuma imagem seja selecionada
        }
    };

    const [name, setName] = useState("");
    const [cnpjEmpresa, setCnpjEmpresa] = useState("");

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
                    <span>
                        <PiIcons.PiXBold className={styles.close} onClick={() => { props.setTrigger(false), setFotoEmpresa(null), setCnpjEmpresa(''), setName('') }} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_img_cadastro}`}>

                        <label className={styles.picture} htmlFor="picture_input">
                            {fotoEmpresa ? (
                                <img src={fotoEmpresa} alt='Foto Empresa' className={styles.picture_image} />
                            ) : (
                                <span className={styles.picture_image}><PiIcons.PiCameraDuotone className={styles.icone_foto} />Enviar foto</span>
                            )}
                        </label>

                        <input type='file' accept='image/jpeg, image/jpg, image/png' id="picture_input" onChange={handleImageChange} />

                        <p>Permitido *.jpeg, *.jpg, *.png<br></br>tamanho máximo de 3 Mb</p>
                    </div>

                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                        <Input type="text" placeholder="Nome da empresa" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input type="text" placeholder="CNPJ (Opcional)" value={cnpjEmpresa} onChange={(e) => setCnpjEmpresa(e.target.value)} />

                        <div className={styles.box_btn_button}>
                            <Button type="submit">Cadastrar</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

    ) : "";
}
