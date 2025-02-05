import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../../../api/api';
import { Layout } from '../../../layout/Layout'

import styles from './EditarEmpresa.module.scss'

import { Input } from '../../../components/Input/Input'
import { Button } from '../../../components/Button/Button'

import * as PiIcons from 'react-icons/pi';

export const EditarEmpresa = () => {

    // Chamando history para redirecionar para outra pagina
    const navigate = useNavigate()

    // Pegando id da URL
    const { id } = useParams();

    const [empresa, setEmpresa] = useState({})

    // Preview da imagem enviada
    const [name, setName] = useState("");
    const [cnpjEmpresa, setCnpjEmpresa] = useState("");
    const [fotoEmpresa, setFotoEmpresa] = useState(null);

    console.log(name, cnpjEmpresa, fotoEmpresa)

    const buscarEmpresa = async () => {
        try {
            const response = await api.get(`/empresas/${id}`)
            if (response.data.length > 0) {
                setEmpresa(response.data[0])
            } else (
                console.log("Nenhuma empresa encontrada!")
            )
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        buscarEmpresa();
    }, [])

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            alert("Por favor, preencha o nome da empresa.");
            return;
        }

        try {
            const formData = new FormData();

            // Adiciona os dados básicos
            formData.append('name', name);

            // Adiciona o CNPJ, se disponível
            if (cnpjEmpresa) {
                formData.append('cnpj_empresa', cnpjEmpresa);
            }

            // Adiciona a nova imagem, se selecionada
            const fileInput = document.getElementById('picture_input');
            if (fileInput.files[0]) {
                formData.append('file', fileInput.files[0]);
            }

            // Envia os dados para a API
            await api.put(`/empresas/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert("Empresa atualizada com sucesso!");
            navigate("/empresas");

        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            alert('Ocorreu um erro ao atualizar a empresa.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Tem certeza que deseja excluir esta empresa?")) {
            try {
                await api.delete(`/empresas/${id}`);
                navigate("/empresas")
            } catch (error) {
                console.error(error)
            }
        }
    }

    return (
        <Layout>
            <div className="box_conteudo_paginas">
                <h2>Editar empresa</h2>

                <div className={styles.box_menu_pagina}>
                    <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                    <PiIcons.PiDotOutlineFill />
                    <Link to='/empresas' className={styles.link_menu_pagina}>Empresas</Link>
                    <PiIcons.PiDotOutlineFill />
                    <p className={styles.link_menu_pagina_atual}>{empresa.name}</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_img_cadastro}`}>

                        <label className={styles.picture} htmlFor="picture_input">
                            {fotoEmpresa ? (
                                <img src={fotoEmpresa ? fotoEmpresa : `${api.defaults.baseURL}/files/${empresa.logo_empresa}`} alt='Foto Empresa' className={styles.picture_image} />
                            ) : (
                                <span className={styles.picture_image}><PiIcons.PiCameraDuotone className={styles.icone_foto} />Enviar foto</span>
                            )}
                        </label>

                        <input type='file' accept='image/jpeg, image/jpg, image/png' id="picture_input" onChange={handleImageChange} />

                        <p>Permitido *.jpeg, *.jpg, *.png<br></br>tamanho máximo de 3 Mb</p>
                    </div>

                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                        <Input type="text" placeholder="Nome da empresa" value={name || empresa.name || ""} onChange={(e) => setName(e.target.value)} />
                        <Input type="text" placeholder="CNPJ (Opcional)" value={cnpjEmpresa || empresa.cnpj_empresa || ""} onChange={(e) => setCnpjEmpresa(e.target.value)} />

                        <div className={styles.box_btn_button}>
                            <Button type="button" className={styles.btn_excluir} onClick={handleDelete}>Excluir</Button>
                            <Button type="submit">Salvar alterações</Button>
                        </div>
                    </div>
                </form>

            </div>
        </Layout>
    )
}
