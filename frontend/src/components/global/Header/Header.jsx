import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../api/api';
import { buscarUsuario } from '../../../services/usuario';
import { logout } from '../../../contexts/util';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import styles from './Header.module.scss';

import * as PiIcons from 'react-icons/pi';
import { CgMenuLeft } from "react-icons/cg";

import { Theme } from '../../../theme/Theme';

import imgSemFoto from '../../../assets/images/imgSemFoto.jpg'

export const Header = ({ setMenuLateralAberto }) => {


    // Estados usuario
    const [usuario, setUsuario] = useState({});

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [fotoUsuario, setFotoUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    // Buscando usuario
    useEffect(() => {
        buscarUsuario(setUsuario, setLoading);
    }, [])

    // Armazenando dados usuario
    useEffect(() => {
        if (usuario) {
            setName(usuario.name || "");
            setEmail(usuario.email || "");
            setFotoUsuario(usuario.img_usuario ? `${api.defaults.baseURL}/files/${usuario.img_usuario}` : null);
        }
    }, [usuario])

    // Estados Menu
    const [abrirMenuMinhaConta, setAbrirMenuMinhaConta] = useState(false);
    const menuMinhaContaRef = useRef(null);

    useEffect(() => {
        if (abrirMenuMinhaConta) {
            document.body.style.overflow = 'hidden'; // Desativa o scroll
        } else {
            document.body.style.overflow = 'auto'; // Restaura o scroll
        }
    }, [abrirMenuMinhaConta]);

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

    return (
        <div className={styles.box_header}>

            <div className={styles.btn_menu_lateral}>
                <CgMenuLeft onClick={() => setMenuLateralAberto((prev) => !prev)} />
            </div>

            <div className={styles.btn_minha_conta_header} ref={menuMinhaContaRef}>

                <div className={styles.box_btns_header}>
                    <span className={styles.background_btn_minha_conta} onClick={() => setAbrirMenuMinhaConta(!abrirMenuMinhaConta)}>
                        {loading ? (
                            <Skeleton
                                circle={true}
                                width={42}
                                height={42}
                                baseColor="rgb(170, 170, 170, .1)"
                                highlightColor="rgb(232, 235, 239, .2)"
                                borderRadius={5}
                                className={styles.img_perfil_minha_conta}
                            />
                        ) : (
                            fotoUsuario ? (
                                <img src={fotoUsuario ? fotoUsuario : `${api.defaults.baseURL}/files/${usuario.img_usuario}`} alt='Foto Empresa' className={styles.btn_minha_conta} />
                            ) : (
                                <img src={imgSemFoto} className={styles.btn_minha_conta} />
                            )
                        )}
                    </span>
                </div>

                <div className={`${styles.box_menu_lateral_header} ${abrirMenuMinhaConta ? styles.ativo : styles.inativo}`}>

                    <div className={styles.box_infos_conta}>

                        <div className={styles.box_btn_fechar} onClick={() => setAbrirMenuMinhaConta(false)}>
                            <span>
                                <PiIcons.PiX />
                            </span>
                        </div>

                        {loading ? (
                            <Skeleton
                                circle={true}
                                width={100}
                                height={100}
                                baseColor="rgb(170, 170, 170, .1)"
                                highlightColor="rgb(232, 235, 239, .2)"
                                borderRadius={5}
                                className={styles.img_perfil_minha_conta}
                            />
                        ) : (
                            fotoUsuario ? (
                                <img src={fotoUsuario ? fotoUsuario : `${api.defaults.baseURL}/files/${usuario.img_usuario}`} alt='Foto Empresa' className={styles.img_perfil_minha_conta} />
                            ) : (
                                <img src={imgSemFoto} className={styles.img_perfil_minha_conta} />
                            )
                        )}

                        <p className={styles.nome_usuario}>{loading ? <Skeleton width={180} height={23} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} /> : name}</p>
                        <p className={styles.email_usuario}>{loading ? <Skeleton width={160} height={18} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' borderRadius={5} /> : email}</p>
                        <div className={styles.box_menu_minha_conta}>
                            <Link to='/user' className={`${styles.btn_menu} ${location.pathname === '/user' ? styles.ativo : ''}`}><PiIcons.PiUser className={styles.icon} /> Minha Conta</Link>
                            {/* <Link to='/financeiro' className={`${styles.btn_menu} ${location.pathname === '/financeiro' ? styles.ativo : ''}`}><PiIcons.PiCurrencyDollar className={styles.icon} /> Financeiro</Link> */}
                        </div>

                    </div>

                    <div className={styles.box_footer_conta}>
                        <div className={styles.box_btn_tema}>
                            <p>Tema</p>
                            <Theme />
                        </div>
                        <Link className={`${styles.btn_menu} ${styles.btn_logout}`} onClick={logout}><PiIcons.PiSignIn className={styles.icon} /> Sair</Link>
                    </div>

                </div>

            </div>

        </div>
    );
};
