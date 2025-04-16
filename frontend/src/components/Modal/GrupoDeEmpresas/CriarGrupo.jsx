import React, { useState } from 'react'

import { Input } from '../../Input/Input'
import { Button } from '../../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from '../Modal.module.scss'
import { criarGrupoEmpresa } from '../../../services/grupoEmpresas';

export const CriarGrupo = ({ trigger, setTrigger, grupoCriado }) => {

    const [name, setName] = useState('');
    // const [emailGrupo, setEmailGrupo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await criarGrupoEmpresa(name)

        if (success) {
            setName('')
            // setEmailGrupo('')
            setTrigger(false)
            grupoCriado()
        }
    };

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Novo grupo de empresas</h3>
                    <span onClick={() => { setTrigger(false), setName('') }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                            <Input
                                type="text"
                                placeholder="Nome do grupo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        {/* <div className={styles.box_dados_empresa}>
                            <Input
                                type="email"
                                placeholder="Email do grupo"
                                value={emailGrupo}
                                onChange={(e) => setEmailGrupo(e.target.value)}
                            />
                        </div> */}

                        <div className={styles.box_btn_button}>
                            <Button type="submit">Cadastrar</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

    ) : "";
}
