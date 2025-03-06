import React, { useEffect, useState } from 'react'
import { buscarCategorias } from '../../../../services/categorias';

import { Input } from '../../../Input/Input'
import { Button } from '../../../Button/Button'
import { Select } from '../../../Select/Select';

import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss'

export const CriarLancamento = ({ trigger, setTrigger }) => {

    // Estados incluri Lancamento
    const [novoLancamentoValor, setNovoLancamentoValor] = useState('')

    const [tipo, setTipo] = useState("RECEITA");

    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        buscarCategorias(setCategorias, setLoading);
    }, [])

    const categoriasFiltradosPorTipo = categorias.filter(categoria => categoria.tipo === tipo)

    const subcategorias = [
        { value: "Bla", label: "Janeiro" },
        { value: "bu", label: "Fevereiro" },
        { value: "jet", label: "Março" },
    ];

    // Formata valor do input
    const formatarValor = (valor) => {
        // Remove tudo que não é número
        valor = valor.replace(/\D/g, "");

        // Converte para número e formata para reais
        valor = (Number(valor) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        return valor;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(novoLancamentoValor, tipo, categoriaSelecionada);
    }

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Nova empresa</h3>
                    <span onClick={() => { setTrigger(false) }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>

                    <Input type="text" placeholder="R$ 0,00" value={novoLancamentoValor} onChange={(e) => setNovoLancamentoValor(formatarValor(e.target.value))} />

                    <div className={styles.box_inputs}>
                        <label htmlFor="receita" className={`${styles.box_input_radio} ${styles.input_receita}`} >
                            <Input type="radio" name="tipo" id="receita" value="RECEITA" onChange={(e) => setTipo(e.target.value)} checked={tipo === "RECEITA"}/>
                            <label htmlFor="receita"><span><PiIcons.PiTrendUpBold /></span> Receita</label>
                        </label>

                        <label htmlFor="despesa" className={`${styles.box_input_radio} ${styles.input_despesa}`}>
                            <Input type="radio" name="tipo" id="despesa" value="DESPESA" onChange={(e) => setTipo(e.target.value)} checked={tipo === "DESPESA"}/>
                            <label htmlFor="despesa"><span><PiIcons.PiTrendDownBold /></span> Despesa</label>
                        </label>
                    </div>

                    <div className={styles.box_inputs}>
                        <Select
                            options={categoriasFiltradosPorTipo.map(categoria => ({ value: categoria.id, label: categoria.name }))}
                            value={categoriaSelecionada}
                            onChange={(e) => setCategoriaSelecionada(e.target.value)}
                            placeholder="Selecione a categoria"
                        />
                    </div>

                    <div className={styles.box_inputs}>
                        <Select
                            options={categoriasFiltradosPorTipo.map(categoria => ({ value: categoria.id, label: categoria.name }))}
                            value={categoriaSelecionada}
                            onChange={(e) => setCategoriaSelecionada(e.target.value)}
                            placeholder="Selecione a categoria"
                        />
                    </div>

                    <div className={styles.box_btn_button}>
                        <Button type="submit"><span><PiIcons.PiPlusBold /></span> Incluir lançamento</Button>
                    </div>

                </form>

            </div>
        </div>

    ) : "";
}
