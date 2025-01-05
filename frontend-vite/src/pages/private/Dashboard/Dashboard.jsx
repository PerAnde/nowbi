import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Link } from 'react-router-dom';

import { Layout } from '../../../layout/layout';

import styles from './Dashboard.module.scss'

export const Dashboard = () => {

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

    // Função para buscar os dados do usuário
    const fetchUsuarioData = async () => {
        try {
            const response = await api.get('/user');  // Fazendo a requisição GET para /user
            setUsuario(response.data);  // Atualiza o estado com os dados do usuário
            setLoading(false);  // Define o carregamento como falso quando os dados são recebidos
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            setLoading(false);  // Define o carregamento como falso em caso de erro
        }

    };

    useEffect(() => {
        fetchUsuarioData();
    }, []);

    if (loading) {
        return (
            <div>
                <p>Carregando...</p>  {/* Exibe uma mensagem de carregamento */}
            </div>
        );
    }

    return (
        <Layout>
            <div className={styles.box_dashboard}>

                <div className={styles.box_header_dashboard}>

                    <div className={styles.box_img_dashboard}>

                        <div className={styles.degrade}></div>

                        <div className={styles.texto_bem_vindo}>
                            <h1>Bem vindo de volta 👋 <br></br>{usuario.name}</h1>
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

                </div>

                <p>Texto Texto Texto</p>
                <p>Texto Texto Texto</p>
                <p>Texto Texto Texto</p>
                <p>Texto Texto Texto</p>
                <p>Texto Texto Texto</p>
                <p>Texto Texto Texto</p>
                <p>Texto Texto Texto</p>
                <p>Texto Texto Texto</p>

            </div>
        </Layout>
    );
};
