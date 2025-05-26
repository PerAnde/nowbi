import React, { useState, useEffect } from 'react';
import { api } from '../../../../api/api';
import { editarEmpresa } from '../../../../services/empresas';
import { formatarCnpj } from '../../../../utils/formatUtils'

import { Input } from '../../../Input/Input';
import { Button } from '../../../Button/Button';

import * as PiIcons from 'react-icons/pi';

import styles from './EditarEmpresa.module.scss';
import { toast } from 'sonner';

export const EditarEmpresa = ({ trigger, setTrigger, empresa, empresaEditada }) => {

    const [name, setName] = useState('');
    const [cnpjEmpresa, setCnpjEmpresa] = useState('');
    const [fotoEmpresa, setFotoEmpresa] = useState(null);
    const [emailAutenticaBi, setEmailAutenticaBi] = useState("");

    const [loading, setLoading] = useState(false)

    // Preencher os estados ao abrir o modal
    useEffect(() => {
        if (empresa) {
            setName(empresa.name || '');
            setCnpjEmpresa(empresa.cnpj_empresa || '');
            setFotoEmpresa(empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : null);
            setEmailAutenticaBi(empresa.email_empresa || '')
        }
    }, [empresa]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFotoEmpresa(e.target.result); // Atualiza o estado com o URL da imagem
            };
            reader.readAsDataURL(file);
        } else {
            setFotoEmpresa(null); // Reseta caso nenhuma imagem seja selecionada
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        if (!empresa?.id) {
            toast.error("ID da empresa não encontrado!")
            return;
        }

        // Adiciona a nova imagem, se selecionada
        const fileInput = document.getElementById('picture_input');
        const fotoEmpresa = fileInput?.files[0] || null;

        const success = await editarEmpresa(empresa.id, name, cnpjEmpresa, emailAutenticaBi, fotoEmpresa);

        if (success) {
            setName("");
            setCnpjEmpresa("");
            setFotoEmpresa(null);
            setTrigger(false);
            empresaEditada();
        }

        setLoading(false)

    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Editar Empresa</h3>
                    <span onClick={() => { setTrigger(false); setFotoEmpresa(empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : null) }}>
                        <PiIcons.PiXBold
                            className={styles.close}
                        />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_img_cadastro}`}>

                        <label className={styles.picture} htmlFor="picture_input">
                            {fotoEmpresa ? (
                                <img src={fotoEmpresa ? fotoEmpresa : `${api.defaults.baseURL}/files/${empresa.logo_empresa}`} alt='Foto Empresa' className={styles.picture_image} />
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
                        <p>Permitido *.jpeg, *.jpg, *.png<br></br>tamanho máximo de 3 Mb</p>
                    </div>


                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                        <div className={styles.box_dados_empresa}>
                            <Input
                                type="text"
                                placeholder="Nome da empresa"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                type="text"
                                placeholder="CNPJ"
                                value={cnpjEmpresa}
                                onChange={(e) => setCnpjEmpresa(formatarCnpj(e.target.value))}
                                maxLength={18}
                            />
                            {/* <Input
                                type="email"
                                placeholder="Email da empresa"
                                value={emailAutenticaBi}
                                onChange={(e) => setEmailAutenticaBi(e.target.value)}
                            /> */}
                        </div>

                        <div className={styles.box_btn_button}>
                            <Button type="submit" loading={loading}>Salvar alterações</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    ) : null;
};
