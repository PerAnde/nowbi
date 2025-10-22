import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsuarioLocalStorage } from '../../../contexts/util'

import styles from './MenuLateral.module.scss';
import * as PiIcons from 'react-icons/pi';
import iconeLogo from '../../../assets/images/icone-logo.png';

export const MenuLateral = ({ menuLateralAberto, setMenuLateralAberto }) => {

    const usuario = getUsuarioLocalStorage();
    const menuLateralRef = useRef(null);

    let diasRestantes = null;

    if (usuario?.isPeriodoTesteAtivo && usuario.dataFimPeriodoTeste) {
        const hoje = new Date();
        const fimTeste = new Date(usuario.dataFimPeriodoTeste);
        const diffEmMs = fimTeste - hoje;
        diasRestantes = Math.max(Math.ceil(diffEmMs / (1000 * 60 * 60 * 24)), 0);
    }

    // // Fechar o menu ao clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Verifica se o clique foi fora do menu e também se não foi no próprio botão de abrir/fechar
            if (menuLateralRef.current && !menuLateralRef.current.contains(event.target) && event.target.closest('.btn_menu_lateral') === null) {
                setMenuLateralAberto(false);  // Fecha o menu se clicar fora, mas não se for no botão
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setMenuLateralAberto]);

    // Fechar o menu ao clicar em um link
    const handleLinkClick = () => {
        setMenuLateralAberto(false);  // Fecha o menu ao clicar no link
    };

    return (

        <div ref={menuLateralRef} className={`${styles.box_menu_lateral} ${menuLateralAberto ? styles.ativo : styles.inativo}`}>

            <div className={styles.conteudo_menu_lateral}>
                <div className={styles.box_logo_now_bi}>
                    <img src={iconeLogo} />
                    <p>NowBI</p>
                </div>

                <div className={styles.menu_lateral}>
                    <div className={styles.links_menu}>
                        <p>Visão Geral</p>
                        <Link to='/dashboard' className={`${styles.btn_menu} ${location.pathname === '/dashboard' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiAlignLeft className={styles.icon} /> Dashboard
                        </Link>
                        <Link to='/empresas' className={`${styles.btn_menu} ${location.pathname === '/empresas' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiBuildings className={styles.icon} /> Empresas
                        </Link>
                        <Link to='/categorias' className={`${styles.btn_menu} ${location.pathname === '/categorias' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiListPlus className={styles.icon} /> Categorias
                        </Link>
                        <p>Conta</p>
                        <Link to='/user' className={`${styles.btn_menu} ${location.pathname === '/user' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiUser className={styles.icon} /> Minha conta
                        </Link>
                        <Link to='/planos' className={`${styles.btn_menu} ${location.pathname === '/planos' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiSketchLogo className={styles.icon} /> Planos
                        </Link>
                        <p>Suporte</p>
                        <Link to='https://api.whatsapp.com/send?phone=5547984178977' target='_blank' className={`${styles.btn_menu} ${location.pathname === '/suporte' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiQuestion className={styles.icon} /> Ajuda
                        </Link>
                    </div>

                    {!usuario.isPlanoAtivo && (
                        <div className={styles.box_mensagem_menu_lateral}>
                            <p>Período experimental</p>
                            <span>
                                {diasRestantes > 0
                                    ? `${diasRestantes} ${diasRestantes === 1 ? 'dia' : 'dias'} restantes`
                                    : 'Período expirado'}
                            </span>
                            <Link className={styles.btn_ativar_conta}>
                                {diasRestantes > 0 ? 'Ativar conta' : 'Escolher plano'}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};
