import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../../api/api';

import { Layout } from '../../../layout/Layout'

import { Input } from '../../../components/Input/Input'
import { Button } from '../../../components/Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from './MinhaConta.module.scss'

export const MinhaConta = () => {

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

        // try {
        //     const formData = new FormData();
        //     formData.append('name', name);
        //     formData.append('cnpj_empresa', cnpjEmpresa)

        //     // Adiciona o arquivo diretamente no formData
        //     const fileInput = document.getElementById('picture_input');
        //     if (fileInput.files[0]) {
        //         formData.append('file', fileInput.files[0]);
        //     }

        //     // Envia os dados usando a API
        //     await api.post('/empresas', formData)

        //     alert('Empresa criada com sucesso!');
        //     setName('');
        //     setCnpjEmpresa('');
        //     setFotoEmpresa(null); // Reseta a foto após o envio

        // } catch (error) {
        //     console.error('Erro ao criar empresa:', error);
        //     alert('Ocorreu um erro ao criar a empresa.');
        // }

    };

    return (
        <Layout>
            <div className="box_conteudo_paginas">
                <h2>Minha conta</h2>

                <div className={styles.box_menu_pagina}>
                    <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                    <PiIcons.PiDotOutlineFill />
                    <p className={styles.link_menu_pagina_atual}>Minha conta</p>
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

                        <Input type="text" placeholder="Nome completo / Razão Social" value={name} onChange={(e) => setName(e.target.value)} />

                        <div className={styles.box_inputs}>
                            <Input type="text" placeholder="Email" disabled />
                            <Input type="text" placeholder="CPF ou CNPJ" disabled value={cnpjEmpresa} onChange={(e) => setCnpjEmpresa(e.target.value)} />
                        </div>

                        <hr />

                        <div className={styles.box_inputs}>
                            <Input type="text" placeholder="Endereço" />
                            <Input type="text" placeholder="Número" />
                            <Input type="text" placeholder="Bairro" />
                            <Input type="text" placeholder="Cidade" />
                        </div>
                        <div className={styles.box_inputs}>
                            <Input type="text" placeholder="Código da Cidade" />
                            <Input type="text" placeholder="Estado" />
                            <Input type="text" placeholder="CEP" />
                        </div>

                        <div className={styles.box_btn_button}>
                            <Button type="submit">Salvar alterações</Button>
                        </div>

                    </div>
                </form>

            </div>
        </Layout>
    )
}
