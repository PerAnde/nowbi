import React, { useState } from 'react'
import { criarCategoria } from '../../../../services/categorias';

import { Input } from '../../../Input/Input'
import { Button } from '../../../Button/Button'
import { SelectGrupoDre } from '../../../Selects/SelectGrupoDre';

import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss'

export const CriarCategoria = ({ trigger, setTrigger, categoriaCriada }) => {

    const [name, setName] = useState("");
    const [tipo, setTipo] = useState("");
    const [grupoDre, setGrupoDre] = useState('NAO_EXIBIR_NO_DRE');
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        const success = await criarCategoria(name, tipo, grupoDre);
        if (success) {
            setName("");
            setTipo("");
            setTrigger(false);
            setGrupoDre("NAO_EXIBIR_NO_DRE"); // Padrao como Nao Exibir no DRE
            categoriaCriada();
        }
    
        setLoading(false)
        
    };

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Nova Categoria</h3>
                    <span onClick={() => { setTrigger(false); setName(""); setTipo(""); setGrupoDre(""); }}>
                        <PiIcons.PiXBold className={styles.close} />
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

                        {tipo && (
                            <div className={styles.box_select}>
                                <SelectGrupoDre tipo={tipo} grupoDre={grupoDre} setGrupoDre={setGrupoDre} />
                            </div>
                        )}

                        <div className={styles.box_btn_button}>
                            <Button type="submit" loading={loading}>Cadastrar</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div >

    ) : "";
}
