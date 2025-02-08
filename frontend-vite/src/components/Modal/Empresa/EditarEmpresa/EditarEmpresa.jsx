import React, { useState, useEffect } from 'react';
import { api } from '../../../../api/api';
import { editarEmpresa } from '../../../../services/empresas';

import { Input } from '../../../Input/Input';
import { Button } from '../../../Button/Button';

import * as PiIcons from 'react-icons/pi';
import styles from './EditarEmpresa.module.scss';
import { toast } from 'sonner';

export const EditarEmpresa = ({ trigger, setTrigger, empresa }) => {

    const [name, setName] = useState('');
    const [cnpjEmpresa, setCnpjEmpresa] = useState('');
    const [fotoEmpresa, setFotoEmpresa] = useState(null);

    // Preencher os estados ao abrir o modal
    useEffect(() => {
        if (empresa) {
            setName(empresa.name || '');
            setCnpjEmpresa(empresa.cnpj_empresa || '');
            setFotoEmpresa(empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : null);
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

        if(!empresa?.id){
            toast.error("ID da empresa não encontrado!")
            return;
        }

        const formData = new FormData();

        // Adiciona os dados básicos
        formData.append('name', name);

        // Adiciona o CNPJ, se disponível
        if (cnpjEmpresa) {
            formData.append('cnpj_empresa', cnpjEmpresa);
        }

        // Adiciona a nova imagem, se selecionada
        const fileInput = document.getElementById('picture_input');
        if (fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
        }

        const success = await editarEmpresa(empresa.id, formData, setTrigger);

        if (success) {
            setName("");
            setCnpjEmpresa("");
            setFotoEmpresa(null);
            setTrigger(false);
        }

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
                                <span className={styles.picture_image}><PiIcons.PiCameraDuotone className={styles.icone_foto} />Enviar foto</span>
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
                        <Input type="text" placeholder="Nome da empresa" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input type="text" placeholder="CNPJ (Opcional)" value={cnpjEmpresa} onChange={(e) => setCnpjEmpresa(e.target.value)} />

                        <div className={styles.box_btn_button}>
                            <Button type="submit">Salvar alterações</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    ) : null;
};
