import React, { useState } from 'react'

import { Input } from '../../Input/Input'
import { Select } from '../../Select/Select'
import { Button } from '../../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from '../Modal.module.scss'

export const CriarLancamento = ({ trigger, setTrigger }) => {

    const [name, setName] = useState("");
    const [tipo, setTipo] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Novo Lançamento</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>

                        <Input type="number" placeholder="Valor" value={name} onChange={(e) => setName(e.target.value)} />
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

                        <div className={styles.box_categorias}>
                            <Input placeholder="Selecione a categoria" />
                            <Input placeholder="Selecione a subcategoria" />
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
