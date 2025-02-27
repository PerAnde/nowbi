import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../api/api';
import { buscarCep } from '../../../services/buscarCep';
import { buscarUsuario, editarUsuario } from '../../../services/usuario';

import { Layout } from '../../../layout/Layout';
import { Input } from '../../../components/Input/Input';
import { Button } from '../../../components/Button/Button';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import * as PiIcons from 'react-icons/pi';

import styles from './MinhaConta.module.scss';
import { toast } from 'sonner';
import { UpgradePlano } from '../../../components/Modal/UpgradePlano/UpgradePlano';

export const MinhaConta = () => {

    // Estados usuario
    const [usuario, setUsuario] = useState({});

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");

    const [cep, setCep] = useState("");
    const [endereco, setEndereco] = useState("");
    const [numero, setNumero] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [ibge, setIbge] = useState("");
    const [estado, setEstado] = useState("");
    const [telefone, setTelefone] = useState("");

    const [cepErro, setCepErro] = useState(false);
    const [fotoUsuario, setFotoUsuario] = useState(null);

    const [loading, setLoading] = useState(true);

    const [popUpUpgrade, setPopUpUpgrade] = useState(false);

    // Buscando usuario
    useEffect(() => {
        buscarUsuario(setUsuario, setLoading);
    }, [])

    // Armazenando dados usuario
    useEffect(() => {
        if (usuario) {
            setId(usuario.id || "");
            setName(usuario.name || "");
            setEmail(usuario.email || "");
            setCpfCnpj(usuario.cpf_cnpj || "");
            setCep(usuario.cep || "");
            setEndereco(usuario.endereco || "");
            setNumero(usuario.numero || "");
            setBairro(usuario.bairro || "");
            setCidade(usuario.cidade || "");
            setIbge(usuario.ibge || "");
            setEstado(usuario.estado || "");
            setTelefone(usuario.telefone || "");
            setFotoUsuario(usuario.img_usuario ? `${api.defaults.baseURL}/files/${usuario.img_usuario}` : null);
        }
    }, [usuario])

    // Atualiza a imagem do usuário
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

    // Envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usuario.id) {
            toast.error("Usuário não autenticado!");
            return;
        }

        if (!name) {
            toast.warning("Insira seu nome ou razão social!")
            return;
        }

        const formData = new FormData();

        formData.append('name', name);
        formData.append('cep', cep);
        formData.append('endereco', endereco);
        formData.append('numero', numero);
        formData.append('bairro', bairro);
        formData.append('cidade', cidade);
        formData.append('ibge', ibge);
        formData.append('estado', estado);
        formData.append('telefone', telefone);

        // Adiciona a nova imagem, se selecionada
        const fileInput = document.getElementById('picture_input');
        if (fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
        }

        editarUsuario(id, formData)

    };

    // Buscar CEP automaticamente
    useEffect(() => {
        if (cep.length === 8) {
            buscarCep(cep, setEndereco, setBairro, setCidade, setIbge, setEstado, setCepErro);
        }
    }, [cep]);

    // Exibir mensagem de erro no CEP
    useEffect(() => {
        if (cepErro) {
            toast.error("CEP inválido ou não encontrado!");
        }
    }, [cepErro]);

    return (
        <Layout>
            <div className="box_conteudo_paginas">
                <div className="header-paginas">
                    <div className="box-header esquerdo">
                        <h2>Minha conta</h2>

                        <div className={styles.box_menu_pagina}>
                            <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Minha conta</p>
                        </div>
                    </div>

                </div>

                {loading ? (
                    <form className={styles.form_cadastro_empresa}>
                        <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                            <div className={styles.box_img_cadastro}>
                                <Skeleton circle={true} width={120} height={120} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                                <Skeleton width={120} height={20} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                            </div>

                            <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />

                            <div className={styles.box_inputs}>
                                <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                                <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                            </div>

                            <hr />

                            <div className={styles.box_inputs}>
                                <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                                <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                                <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                                <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                            </div>

                            <div className={styles.box_inputs}>
                                <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                                <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                                <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                                <Skeleton width='100%' height={50} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                            </div>

                            <div className={styles.box_btn_button}>
                                <Skeleton width={130} height={40} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                            </div>
                        </div>

                        <div className={`${styles.box_componente} ${styles.box_img_cadastro}`}></div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                        {/* Dados do usuário */}
                        <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                            <div className={styles.box_img_cadastro}>
                                <label className={styles.picture} htmlFor="picture_input">
                                    {fotoUsuario ? (
                                        <img src={fotoUsuario ? fotoUsuario : `${api.defaults.baseURL}/files/${usuario.img_usuario}`} alt='Foto Empresa' className={styles.picture_image} />
                                    ) : (
                                        <span className={styles.picture_image}>
                                            <PiIcons.PiCameraDuotone className={styles.icone_foto} /> Enviar foto
                                        </span>
                                    )}
                                </label>
                                <input
                                    type='file'
                                    accept='image/jpeg, image/jpg, image/png'
                                    id="picture_input"
                                    onChange={handleImageChange}
                                />
                                <p className={styles.infos_sobre_imagem}>Permitido *.jpeg, *.jpg, *.png<br />Tamanho máximo de 3 Mb</p>
                            </div>

                            <Input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />

                            <div className={styles.box_inputs}>
                                <Input type="text" placeholder="Email" value={email} disabled />
                                <Input type="text" placeholder="CPF ou CNPJ" value={cpfCnpj} disabled />
                            </div>

                            <hr />

                            <div className={styles.box_inputs}>
                                <Input type="text" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))} maxLength={8} />
                                <Input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                                <Input type="text" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
                                <Input type="text" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                            </div>
                            <div className={styles.box_inputs}>
                                <Input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                                <Input type="text" placeholder="IBGE" value={ibge} onChange={(e) => setIbge(e.target.value)} />
                                <Input type="text" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
                                <Input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} maxLength={15} />
                            </div>

                            <div className={styles.box_btn_button}>
                                <Button type="submit">Salvar alterações</Button>
                            </div>
                        </div>

                        <div className={`${styles.box_componente} ${styles.box_infos_plano}`}>
                            <div className={styles.header_box_plano}>
                                <span>Seu plano</span>
                                <h2>Free</h2>
                            </div>

                            <div className={styles.periodo_teste}>
                                <p>7 dias restantes</p>
                            </div>

                            <div className={styles.descricao_plano}>
                                <p>Quantidade de empresas</p>
                                <p>Quantidade de usuários</p>
                            </div>

                            <div className={styles.box_btn_ativacao_upgrade}>
                                <Link className={styles.btn_link_principal} onClick={() => setPopUpUpgrade(true)}><PiIcons.PiPlusBold /> Ativar conta</Link>
                            </div>
                        </div>
                    </form>
                )}

            </div>

            <UpgradePlano trigger={popUpUpgrade} setTrigger={setPopUpUpgrade} />

        </Layout>
    );
};
