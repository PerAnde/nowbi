import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { logout } from '../../contexts/util';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import styles from './Header.module.scss';

import * as PiIcons from 'react-icons/pi';

import imgPerfil from '../../assets/images/avatar-25.webp';

import { Theme } from '../../theme/Theme';

export const Header = ({ setMenuLateralAberto }) => {

    const [abrirMenuMinhaConta, setAbrirMenuMinhaConta] = useState(false);

    const menuMinhaContaRef = useRef(null);

    // Ajuste para desabilitar o scroll quando o menu Minha Conta estiver aberto
    useEffect(() => {
        if (abrirMenuMinhaConta) {
            document.body.style.overflow = 'hidden'; // Desativa o scroll
        } else {
            document.body.style.overflow = 'auto'; // Restaura o scroll
        }
    }, [abrirMenuMinhaConta]); // Executa toda vez que abrirMenuMinhaConta mudar

    useEffect(() => {
        const handleMenuMinhaConta = (event) => {
            if (menuMinhaContaRef.current && !menuMinhaContaRef.current.contains(event.target)) {
                setAbrirMenuMinhaConta(false);
            }
        };

        document.addEventListener('mousedown', handleMenuMinhaConta);
        return () => {
            document.removeEventListener('mousedown', handleMenuMinhaConta);
        };
    }, []);

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

    return (
        <div className={styles.box_header}>

            <div className={styles.btn_menu_lateral}>
                <PiIcons.PiCaretDoubleRightDuotone onClick={() => setMenuLateralAberto((prev) => !prev)}/>
            </div>

            <div className={styles.btn_minha_conta_header} ref={menuMinhaContaRef}>

                <span className={styles.background_btn_minha_conta} onClick={() => setAbrirMenuMinhaConta(!abrirMenuMinhaConta)}>
                    <img src={imgPerfil} className={styles.btn_minha_conta} />
                </span>

                <div className={`${styles.box_minha_conta} ${abrirMenuMinhaConta ? styles.ativo : styles.inativo}`}>

                    <div className={styles.box_infos_conta}>

                        <div className={styles.box_btn_fechar} onClick={() => setAbrirMenuMinhaConta(false)}>
                            <span>
                                <PiIcons.PiX />
                            </span>
                        </div>

                        <img src={imgPerfil} className={styles.img_perfil_minha_conta} />

                        <p className={styles.nome_usuario}>{loading ? <Skeleton width={200} height={27} baseColor='rgb(232, 235, 239, .2)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} /> : usuario.name}</p>
                        <p className={styles.email_usuario}>{loading ? <Skeleton width={200} height={27} baseColor='rgb(232, 235, 239, .2)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} /> : usuario.email}</p>
                        <div className={styles.box_menu_minha_conta}>
                            <Link to='/minhaconta' className={`${styles.btn_menu} ${location.pathname === '/minhaconta' ? styles.ativo : ''}`}><PiIcons.PiUserDuotone className={styles.icon} /> Minha Conta</Link>
                            <Link to='/financeiro' className={`${styles.btn_menu} ${location.pathname === '/financeiro' ? styles.ativo : ''}`}><PiIcons.PiCurrencyDollarDuotone  className={styles.icon} /> Financeiro</Link>
                        </div>

                    </div>

                    <div className={styles.box_footer_conta}>
                        <div className={styles.box_btn_tema}>
                            <p>Tema</p>
                            <Theme />
                        </div>
                        <Link className={`${styles.btn_menu} ${styles.btn_logout}`} onClick={logout}><PiIcons.PiSignInDuotone className={styles.icon} /> Sair</Link>
                    </div>

                </div>

            </div>

        </div>
    );
};
