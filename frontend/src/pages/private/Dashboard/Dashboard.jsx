import { useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { Link } from 'react-router-dom';
import { formatarValorExibicao, capitalizeFirstLetter } from '../../../utils/formatUtils'
import { getUsuarioLocalStorage } from '../../../contexts/util';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import { Layout } from '../../../layout/Layout';

import styles from './Dashboard.module.scss'

import * as PiIcons from 'react-icons/pi';

export const Dashboard = () => {

    const dadosUsuario = getUsuarioLocalStorage();
    const [usuario, setUsuario] = useState(null);
    const [totalEmpresas, setTotalEmpresas] = useState(null);
    const [totalBis, setTotalBis] = useState(0);
    const [totalBisConcluidos, setTotalBisConcluidos] = useState(0)
    const [loading, setLoading] = useState(true);

    // Função para buscar os dados do usuário
    const fetchUsuarioData = async () => {
        try {
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

            const total = response.data.reduce((acc, empresa) => acc + (empresa.bis?.length || 0), 0);
            setTotalBis(total);

            const totalAtivos = response.data.reduce(
                (acc, empresa) => acc + (empresa.bis?.filter(bi => bi.status === true).length || 0),
                0
            );
            setTotalBisConcluidos(totalAtivos);

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

                    <div className={styles.banner_novidade}>
                        <div className={styles.banner_novidade_conteudo}>
                            <div className={styles.banner_novidade_topo}>
                                <span className={styles.banner_novidade_tag}>
                                    <PiIcons.PiSparkleFill />
                                    UMA NOVA ERA ESTÁ CHEGANDO
                                </span>

                                <span className={styles.banner_novidade_data}>
                                    25 OUT 2026
                                </span>
                            </div>

                            <h2>
                                O NowBI está evoluindo.
                                <span> E você vai sentir a diferença.</span>
                            </h2>

                            <p>
                                Estamos preparando uma nova versão, muito mais
                                completa, moderna e poderosa para transformar
                                a maneira como você acompanha e gerencia
                                seus negócios.
                            </p>

                            <div className={styles.banner_novidade_lancamento}>
                                <PiIcons.PiCalendarBlankLight />
                                <strong>
                                    A novidade chega em 25 de outubro.
                                </strong>
                            </div>

                            <div className={styles.banner_novidade_rodape}>
                                <PiIcons.PiRocketLaunchLight />
                                <span>
                                    Mais recursos. Mais possibilidades.
                                    Uma nova experiência.
                                </span>
                            </div>
                        </div>

                        <div className={styles.banner_novidade_glow}></div>
                    </div>


                    <div className={styles.waves}>
                        <div className={`${styles.wave} ${styles.wave1}`}></div>
                        <div className={`${styles.wave} ${styles.wave2}`}></div>
                        <div className={`${styles.wave} ${styles.wave3}`}></div>
                    </div>

                    <div className={styles.texto_bem_vindo}>
                        <h1>
                            Bem vindo de volta 👋 <br />
                            {loading
                                ? <Skeleton width={200} height={27} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} />
                                : capitalizeFirstLetter(usuario.name)}
                        </h1>

                        <p>Acompanhe e gerencie suas empresas agora mesmo!</p>

                        <Link to="/empresas" className={styles.btn_cor_primaria}>
                            Ver Empresas
                        </Link>
                    </div>

                </div>

                <div className={styles.box_info_financeiro}>

                    <div className={styles.box_header_fatura}>
                        <p>Seu Plano</p>
                        <span>{usuario?.plano?.nome}</span>
                    </div>

                    {!usuario?.isPlanoAtivo ? (
                        ''
                    ) : (
                        <div className={styles.box_infos_fatura}>
                            <div>
                                <p>Valor</p>
                                <p><span>{formatarValorExibicao(usuario?.plano?.valor)}</span></p>
                            </div>
                            <div>
                                <p>Total de empresas</p>
                                <p><span>{usuario?.plano?.limiteEmpresas}</span></p>
                            </div>
                        </div>
                    )}
                    {/* 
                    <div className={styles.box_btn_fatura}>
                        <Link to='/financeiro' className={styles.btn_upgrade}>Fazer upgrade</Link>
                        <Link to='/planos' className={styles.btn_pagar_fatura}>Acessar Fatura</Link>
                    </div> */}

                </div>

                <div className={`${styles.box_info_dashboard} ${styles.info_total_empresas}`}>
                    <div className={styles.infos_card}>
                        <span>{loading ? <Skeleton width={50} height={27} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} /> : totalEmpresas ? totalEmpresas.length : 0}</span>
                        <p>Empresas</p>
                    </div>
                    <div className={styles.icone_card}>
                        <PiIcons.PiBuildingLight />
                    </div>
                    <span className={styles.background_card}></span>
                </div>

                <div className={`${styles.box_info_dashboard} ${styles.info_total_bis}`}>
                    <div className={styles.infos_card}>
                        <span>{loading ? <Skeleton width={50} height={27} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} /> : totalBis ? totalBis : 0}</span>
                        <p>BI's</p>
                    </div>
                    <div className={styles.icone_card}>
                        <PiIcons.PiSpinnerGapLight />
                    </div>
                    <span className={styles.background_card}></span>
                </div>

                <div className={`${styles.box_info_dashboard} ${styles.info_total_concluido}`}>
                    <div className={styles.infos_card}>
                        <span>{loading ? <Skeleton width={50} height={27} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} /> : totalBisConcluidos ? totalBisConcluidos : 0}</span>
                        <p>BI's Concluídos</p>
                    </div>
                    <div className={styles.icone_card}>
                        <PiIcons.PiChecksLight />
                    </div>
                    <span className={styles.background_card}></span>
                </div>

            </div>
        </Layout>
    );
};
