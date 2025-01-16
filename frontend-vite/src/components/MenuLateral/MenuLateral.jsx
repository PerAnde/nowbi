import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './MenuLateral.module.scss';
import * as PiIcons from 'react-icons/pi';
import iconeLogo from '../../assets/images/icone-logo.png';

export const MenuLateral = ({ menuLateralAberto, setMenuLateralAberto }) => {

    const menuLateralRef = useRef(null);

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
                    <p>now<span>BI</span></p>
                </div>

                <div className={styles.menu_lateral}>
                    <div className={styles.links_menu}>
                        <p>Visão Geral</p>
                        <Link to='/dashboard' className={`${styles.btn_menu} ${location.pathname === '/dashboard' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiAlignLeftDuotone className={styles.icon} /> Dashboard
                        </Link>
                        <Link to='/novaempresa' className={`${styles.btn_menu} ${location.pathname === '/novaempresa' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiPlusBold className={styles.icon} /> Nova Empresa
                        </Link>
                        <Link to='/empresas' className={`${styles.btn_menu} ${location.pathname === '/empresas' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiBuildingOfficeDuotone className={styles.icon} /> Empresas
                        </Link>
                        <p>Conta</p>
                        <Link to='/minhaconta' className={`${styles.btn_menu} ${location.pathname === '/minhaconta' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiUserDuotone className={styles.icon} /> Minha conta
                        </Link>
                        <Link to='/financeiro' className={`${styles.btn_menu} ${location.pathname === '/financeiro' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiCurrencyDollarDuotone className={styles.icon} /> Financeiro
                        </Link>
                        <p>Suporte</p>
                        <Link to='/suporte' className={`${styles.btn_menu} ${location.pathname === '/suporte' ? styles.ativo : ''}`} onClick={handleLinkClick} >
                            <PiIcons.PiQuestionDuotone className={styles.icon} /> Ajuda
                        </Link>
                    </div>

                    <div className={styles.box_mensagem_menu_lateral}>
                        <p>Período experimental</p>
                        <span>7 dias restantes</span>
                        <Link className={styles.btn_ativar_conta}>Ativar conta</Link>
                    </div>
                </div>
            </div>

        </div>
    );
};
