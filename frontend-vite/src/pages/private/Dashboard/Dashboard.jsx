import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Link } from 'react-router-dom';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import { Layout } from '../../../layout/Layout';

import styles from './Dashboard.module.scss'

import * as PiIcons from 'react-icons/pi';

export const Dashboard = () => {

    const [usuario, setUsuario] = useState(null);
    const [totalEmpresas, setTotalEmpresas] = useState(null);
    const [loading, setLoading] = useState(true);

    // Função para buscar os dados do usuário
    const fetchUsuarioData = async () => {
        try {

            // Time para testar Skeletons
            await new Promise(resolve => setTimeout(resolve, 7000))

            const response = await api.get('/user');
            setUsuario(response.data);
            setLoading(false);

        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchUsuarioData();
    }, []);

    const buscarEmpresas = async () => {
        try {
            const response = await api.get('/empresas');
            setTotalEmpresas(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        buscarEmpresas();
    }, [])

    return (
        <Layout>
            <div className='box_conteudo_paginas'>
                <h2>Dashboard</h2>

                <div className={styles.box_img_dashboard}>

                    <div className={styles.degrade}></div>

                    <div className={styles.texto_bem_vindo}>
                        <h1>Bem vindo de volta 👋 <br />
                            {loading ? <Skeleton width={200} height={27} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} /> : usuario.name}</h1>
                        <p>Acompanhe e gerencie seus BIs agora mesmo!</p>

                        <Link to="/empresas" className={styles.btn_cor_primaria}>Ver Empresas</Link>
                    </div>

                </div>

                <div className={styles.box_info_financeiro}>

                    <div className={styles.box_header_fatura}>
                        <p>Última fatura</p>
                        <span>R$ 100,00</span>
                    </div>

                    <div className={styles.box_infos_fatura}>
                        <div>
                            <p>Vencimento:</p>
                            <p>10/01/2025</p>
                        </div>
                        <div>
                            <p>Status:</p>
                            <p>Em aberto</p>
                        </div>
                    </div>

                    <div className={styles.box_btn_fatura}>
                        <Link to='/financeiro' className={styles.btn_fatura}>Histórico financeiro</Link>
                        <Link to='/dashboard' className={`${styles.btn_fatura} ${styles.btn_pagar_fatura}`}>Pagar fatura</Link>
                    </div>

                </div>

                <div className={`${styles.box_info_dashboard} ${styles.info_total_empresas}`}>
                    <div className={styles.infos_card}>
                        <p>Empresas</p>
                        <span>{loading ? <Skeleton width={50} height={27} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} /> : totalEmpresas ? totalEmpresas.length : 0}</span>
                    </div>
                    <div className={styles.icone_card}>
                        <PiIcons.PiBuildings />
                    </div>
                </div>

                <div className={`${styles.box_info_dashboard} ${styles.info_total_bis}`}>
                    <div className={styles.infos_card}>
                        <p>BI's</p>
                        <span>42</span>
                    </div>
                    <div className={styles.icone_card}>
                        <PiIcons.PiChartBar />
                    </div>
                </div>

                <div className={`${styles.box_info_dashboard} ${styles.info_total_movimentado}`}>
                    <div className={styles.infos_card}>
                        <p>BI's Concluídos</p>
                        <span>14</span>
                    </div>
                    <div className={styles.icone_card}>
                        <PiIcons.PiCheckFat />
                    </div>
                </div>

            </div>
        </Layout>
    );
};
