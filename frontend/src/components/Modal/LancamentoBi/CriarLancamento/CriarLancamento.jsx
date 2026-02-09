import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { criarLancamento } from '../../../../services/lancamentos';
import { formatarValor, removerFormatacaoMoeda } from '../../../../utils/formatUtils'

import { Input } from '../../../Input/Input'
import { Button } from '../../../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss'
import { SelectCategoria } from '../../../Selects/SelectCategoria';
import { SelectSubcategoria } from '../../../Selects/SelectSubcategoria';

export const CriarLancamento = ({ trigger, setTrigger, lancamentoCriado }) => {

    // ID do BI
    const { id } = useParams();
    // Estados incluri Lancamento
    const [valor, setValor] = useState('')
    const [tipo, setTipo] = useState("RECEITA");

    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("");

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setCategoriaSelecionada("");
        setSubcategoriaSelecionada("");
    }, [tipo])

    useEffect(() => {
        setSubcategoriaSelecionada("");
    }, [categoriaSelecionada])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        const valorNumerico = removerFormatacaoMoeda(valor);

        const success = await criarLancamento(id, valorNumerico, tipo, categoriaSelecionada, subcategoriaSelecionada)

        if (success) {
            setValor("");
            setCategoriaSelecionada("");
            setSubcategoriaSelecionada("");
            lancamentoCriado();
        }

        setLoading(false)
    }

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Novo Lançamento</h3>
                    <span onClick={() => { setTrigger(false), setValor(""), setTipo("RECEITA"), setCategoriaSelecionada(""), setSubcategoriaSelecionada("") }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>

                    <Input type="text" placeholder="R$ 0,00" value={valor} onChange={(e) => setValor(formatarValor(e.target.value))} />

                    <div className={styles.box_inputs}>
                        <label htmlFor="receita" className={`${styles.box_input_radio} ${styles.input_receita}`} >
                            <Input type="radio" name="tipo" id="receita" value="RECEITA" onChange={(e) => setTipo(e.target.value)} checked={tipo === "RECEITA"} />
                            <label htmlFor="receita"><span><PiIcons.PiTrendUpLight /></span> Receita</label>
                        </label>

                        <label htmlFor="despesa" className={`${styles.box_input_radio} ${styles.input_despesa}`}>
                            <Input type="radio" name="tipo" id="despesa" value="DESPESA" onChange={(e) => setTipo(e.target.value)} checked={tipo === "DESPESA"} />
                            <label htmlFor="despesa"><span><PiIcons.PiTrendDownLight /></span> Despesa</label>
                        </label>
                    </div>

                    <div className={styles.box_selects}>
                        <div className={styles.box_select}>
                            <SelectCategoria
                                tipo={tipo}
                                categoriaSelecionada={categoriaSelecionada}
                                setCategoriaSelecionada={setCategoriaSelecionada}
                            />
                        </div>

                        <div className={styles.box_select}>
                            <SelectSubcategoria
                                categoriaSelecionada={categoriaSelecionada}
                                subcategoriaSelecionada={subcategoriaSelecionada}
                                setSubcategoriaSelecionada={setSubcategoriaSelecionada}
                            />
                        </div>
                    </div>

                    <div className={styles.box_btn_button}>
                        <Button type="submit" loading={loading}><span><PiIcons.PiPlusBold /></span> Incluir lançamento</Button>
                    </div>

                </form>

            </div>
        </div>

    ) : "";
}
