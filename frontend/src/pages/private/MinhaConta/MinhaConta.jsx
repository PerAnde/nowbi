import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { buscarUsuario } from '../../../services/usuario'
import axios from 'axios'

import { Layout } from '../../../layout/Layout'

import { Input } from '../../../components/Input/Input'
import { Button } from '../../../components/Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from './MinhaConta.module.scss'

export const MinhaConta = () => {

    // Estados usuario
    const [usuario, setUsuario] = useState(null);

    const [name, setName] = useState("");
    const [cep, setCep] = useState("");
    const [endereco, setEndereco] = useState("");
    const [numero, setNumero] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [ibge, setIbge] = useState("");
    const [estado, setEstado] = useState("");
    const [telefone, setTelefone] = useState("");

    console.log(name)

    // Preview da imagem enviada
    const [fotoUsuario, setFotoUsuario] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFotoUsuario(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFotoUsuario(null);
        }
    };

    // Atualiza usuario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await buscarUsuario(setUsuario);

    };

    useEffect(() => {
        console.log(usuario);
    }, [usuario]);

    // Buscar Cep
    // axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    //     .then(res => {
    //         setEndereco(res.data.logradouro)
    //         setBairro(res.data.bairro)
    //         setCidade(res.data.localidade)
    //         setIbge(res.data.ibge)
    //         setEstado(res.data.estado)
    //         setEstaComErro(false)
    //     })

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
                            {fotoUsuario ? (
                                <img src={fotoUsuario} alt='Foto Empresa' className={styles.picture_image} />
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
                            <Input type="text" placeholder="CPF ou CNPJ" disabled />
                        </div>

                        <hr />

                        <div className={styles.box_inputs}>
                            <Input type="text" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} maxLength={8} />
                            <Input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                            <Input type="text" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
                            <Input type="text" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                        </div>
                        <div className={styles.box_inputs}>
                            <Input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                            <Input type="text" placeholder="IBGE" value={ibge} onChange={(e) => setIbge(e.target.value)} />
                            <Input type="text" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
                            <Input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
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
