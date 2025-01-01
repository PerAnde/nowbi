import { useEffect, useState } from 'react';
import { api } from '../../services/api';

// Imagens
import iconeLogo from '../../assets/images/icone-logo.svg'

import styles from './Header.module.scss'

// Icones
// import * as PiIcons from "react-icons/pi";

export const Header = () => {

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
            <div className={styles.box_header}>
                <p>Carregando...</p>  {/* Exibe uma mensagem de carregamento */}
            </div>
        );
    }

    return (
        <div className={styles.box_header}>

            <div className={styles.box_logo_now_bi}>
                <img src={iconeLogo} />
                <p>now<span>BI</span></p>
            </div>

            <div className={styles.box_nome_header}>
                <p>Olá, <strong>{usuario.name}</strong></p>
            </div>

            <div className={styles.box_menu_header}>
                <span></span>
            </div>

        </div>
    )
}
