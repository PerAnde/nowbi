import React, { useState } from 'react'
import { criarEmpresa } from '../../../../services/empresas';
import { formatarCnpj } from '../../../../utils/formatUtils';

import { Input } from '../../../Input/Input'
import { Button } from '../../../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss'

export const CriarEmpresa = ({ trigger, setTrigger, empresaCriada }) => {

    // Preview da imagem enviada
    const [fotoEmpresa, setFotoEmpresa] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFotoEmpresa(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFotoEmpresa(null);
        }
    };

    const [name, setName] = useState("");
    const [cnpjEmpresa, setCnpjEmpresa] = useState("");
    const [emailAutenticaBi, setEmailAutenticaBi] = useState("");

    const [categoriasPadrao, setCategoriasPadrao] = useState(true);

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        // Adiciona o arquivo diretamente no formData
        const fileInput = document.getElementById('picture_input');
        const fotoEmpresa = fileInput?.files[0] || null;

        const success = await criarEmpresa(name, cnpjEmpresa, emailAutenticaBi, fotoEmpresa, categoriasPadrao)

        if (success) {
            setName("");
            setCnpjEmpresa("");
            setEmailAutenticaBi("");
            setFotoEmpresa(null);
            setCategoriasPadrao(true);
            setTrigger(false);
            empresaCriada();
        }

        setLoading(false)

    };

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Nova empresa</h3>
                    <span onClick={() => { setTrigger(false), setFotoEmpresa(null), setCnpjEmpresa(''), setName(''), setEmailAutenticaBi('') }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_img_cadastro}`}>

                        <label className={styles.picture} htmlFor="picture_input">
                            {fotoEmpresa ? (
                                <img src={fotoEmpresa} alt='Foto Empresa' className={styles.picture_image} />
                            ) : (
                                <span className={styles.picture_image}><PiIcons.PiCameraDuotone className={styles.icone_foto} />Enviar foto</span>
                            )}
                        </label>

                        <input type='file' accept='image/jpeg, image/jpg, image/png' id="picture_input" onChange={handleImageChange} />

                        <p>Permitido *.jpeg, *.jpg, *.png<br></br>(máx 3 mb)</p>
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

                            <div className={styles.container_checkbox}>
                                <label className={styles.checkbox_confirmar}>
                                    <Input
                                        type="checkbox"
                                        id="confirmarExclusao"
                                        checked={categoriasPadrao}
                                        onChange={(e) => setCategoriasPadrao(e.target.checked)}
                                        className={styles.input_checkbox}
                                    />
                                    <span className={styles.custom_checkbox}>
                                        <PiIcons.PiCheckFatFill className={styles.custom_icon} />
                                    </span>
                                    <div className={styles.texto_checkbox}>
                                        <p>Criar com plano de categorias padrão</p>
                                        <span>Gerar automaticamente categorias e subcategorias essenciais.</span>
                                    </div>
                                </label>
                            </div>
                            {/* <Input
                                type="email"
                                placeholder="Email da empresa"
                                value={emailAutenticaBi}
                                onChange={(e) => setEmailAutenticaBi(e.target.value)}
                            /> */}
                        </div>

                        <div className={styles.box_btn_button}>
                            <Button type="submit" loading={loading}>Cadastrar</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

    ) : "";
}
