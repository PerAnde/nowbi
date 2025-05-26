import React, { useEffect, useState } from 'react'

import { Input } from '../../Input/Input'
import { Button } from '../../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from '../Modal.module.scss'
import { editarGrupo } from '../../../services/grupoEmpresas';

export const EditarGrupo = ({ trigger, setTrigger, grupo, grupoAtualizado }) => {

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    // const [emailGrupo, setEmailGrupo] = useState('');
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (grupo) {
            setId(grupo[0]?.id || '')
            setName(grupo[0]?.name || '');
            // setEmailGrupo(grupo[0]?.email_grupo || '');
        }
    }, [grupo])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        const success = await editarGrupo(id, name, setTrigger)

        if (success) {
            setId('')
            setName('')
            // setEmailGrupo('')
            setTrigger(false)
            grupoAtualizado()
        }

        setLoading(false)
    };

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Editar grupo</h3>
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
                            <Button type="submit" loading={loading}>Salvar alterações</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

    ) : "";
}
