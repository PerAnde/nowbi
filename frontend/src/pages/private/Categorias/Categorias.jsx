import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../../layout/Layout';
import { Input } from '../../../components/Input/Input';

import { buscarCategoriasEmpresas } from '../../../services/categorias';
import { api } from '../../../api/api';
import imgEmpresaSemLogo from '../../../assets/images/imgEmpresaSemLogo.jpg'

import * as PiIcons from 'react-icons/pi';
import styles from './Categorias.module.scss';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

export const Categorias = () => {

    // Armazena categorias
    const [empresas, setEmpresas] = useState([]);
    // Loading categorias
    const [loading, setLoading] = useState(true);
    // Busca
    const [busca, setBusca] = useState('');

    // Buscar categorias
    useEffect(() => {
        // Chamamos o novo serviço que você acabou de criar
        buscarCategoriasEmpresas(setEmpresas, setLoading);
    }, []);

    const buscaEmpresa = empresas.filter(empresa =>
        empresa.name.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <Layout>
            <div className="box_conteudo_paginas">
                <div className="header-paginas">
                    <div className="box-header">
                        <h2>Categorias</h2>
                        <div className={styles.box_menu_pagina}>
                            <Link to="/dashboard" className={styles.link_menu_pagina}>
                                Dashboard
                            </Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>Categorias</p>
                        </div>
                    </div>

                </div>

                {loading ? (
                    Array.from({ length: 10 }).map((_, id) => (
                        <div key={id} className={styles.box_categorias}>

                            <div className={styles.box_categoria}>
                                <Skeleton height={25} width="100%" borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                <Skeleton height={25} width="100%" borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                <Skeleton height={25} width="100%" borderRadius={5} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.box_categorias}>
                        <div className={styles.box_input_busca}>
                            <Input
                                type="text"
                                placeholder="Buscar empresa..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className={styles.input_busca}
                            />
                        </div>

                        {buscaEmpresa.map((empresa) => (
                            <div key={empresa.id} className={styles.box_categorias}>
                                <div className={styles.box_categoria}>
                                    <div className={styles.box_indos_empresa}>
                                        <div className={styles.box_img_logo_empresa}>
                                            <img
                                                src={empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : imgEmpresaSemLogo}
                                                alt="Logo Empresa"
                                            />
                                        </div>
                                        <div className={styles.categoria_nome}>{empresa.name}</div>
                                    </div>
                                    <div className={styles.btn_gerenciar_categorias}>
                                        <Link
                                            className={styles.btn_link_secundario}
                                            to={`/categorias/empresa/${empresa.id}`}
                                        >
                                            Gerenciar
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};
