import React, { useState } from 'react'
import { api } from '../../../services/api'

import { Input } from '../../Input/Input'
import { Button } from '../../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from '../Modal.module.scss'

export const CriarCategoria = (props) => {

    const [name, setName] = useState("");
    const [tipo, setTipo] = useState("");

    console.log(name, tipo)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            alert("Por favor, preencha o nome da categoria.");
            return;
        }

        if (!tipo) {
            alert("Por favor, selecione RECEITA ou DESPESA");
            return;
        }

        try {

            const data = {
                name: name,
                tipo: tipo,
            }

            await api.post('/categorias', data)
            setName('')
            setTipo('')
            props.setTrigger(false)


        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            alert('Erro ao criar categoria.');
        }

    };

    return (props.trigger) ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Nova Categoria</h3>
                    <span>
                        <PiIcons.PiXBold className={styles.close} onClick={() => { props.setTrigger(false), setName(''), setTipo('') }} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                        <Input type="text" placeholder="Nome da categoria" value={name} onChange={(e) => setName(e.target.value)} />
                        <div className={styles.box_inputs}>
                            <label htmlFor="receita" className={`${styles.box_input_radio} ${styles.input_receita}`} >
                                <Input type="radio" name="tipo" id="receita" value="RECEITA" onChange={(e) => setTipo(e.target.value)} />
                                <label htmlFor="receita"><span><PiIcons.PiTrendUpBold /></span> Receita</label>
                            </label>
                            <label htmlFor="despesa" className={`${styles.box_input_radio} ${styles.input_despesa}`}>
                                <Input type="radio" name="tipo" id="despesa" value="DESPESA" onChange={(e) => setTipo(e.target.value)} />
                                <label htmlFor="despesa"><span><PiIcons.PiTrendDownBold /></span> Despesa</label>
                            </label>
                        </div>

                        <div className={styles.box_btn_button}>
                            <Button type="submit">Cadastrar</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

    ) : "";
}
