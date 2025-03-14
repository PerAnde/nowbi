import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { buscarCategorias, buscarCategoria } from '../../../../services/categorias';
import { criarLancamento } from '../../../../services/lancamentos';

import { Input } from '../../../Input/Input'
import { Button } from '../../../Button/Button'
import { Select } from '../../../Select/Select';

import * as PiIcons from 'react-icons/pi';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import styles from '../../Modal.module.scss'

export const CriarLancamento = ({ trigger, setTrigger, lancamentoCriado }) => {

    // Estados incluri Lancamento
    const [valor, setValor] = useState('')
    const [tipo, setTipo] = useState("RECEITA");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("");
    const { id } = useParams();

    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);

    const [loading, setLoading] = useState(false);

    // Buscando todas as categorias
    useEffect(() => {
        buscarCategorias(setCategorias, setLoading);
    }, [])

    // Filtrando select de categorias pelo tipo RECEITA ou DESPESA
    const categoriasFiltradosPorTipo = categorias.filter(categoria => categoria.tipo === tipo)

    // Atualiza as subcategorias quando uma categoria é buscada
    useEffect(() => {
        if (categoria && categoria.subcategorias) {
            setSubcategorias(categoria.subcategorias);
        } else {
            setSubcategorias([]); // Se não houver subcategorias, zera a lista
        }
    }, [categoria]);

    // Buscar subcategorias da categoria selecionada
    useEffect(() => {
        if (categoriaSelecionada) {
            buscarCategoria(categoriaSelecionada, setCategoria, setLoading);
        }
    }, [categoriaSelecionada]);

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

    // Removendo formatação para enviar pra a API
    const removerFormatacaoMoeda = (valor) => {
        return Number(valor.replace(/[^0-9,-]+/g, "").replace(",", "."));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const valorNumerico = removerFormatacaoMoeda(valor);

        const success = await criarLancamento(id, valorNumerico, tipo, categoriaSelecionada, subcategoriaSelecionada)

        if (success) {
            setValor("");
            setCategoriaSelecionada("");
            setSubcategoriaSelecionada("");
            lancamentoCriado();
        }
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
                            <label htmlFor="receita"><span><PiIcons.PiTrendUpBold /></span> Receita</label>
                        </label>

                        <label htmlFor="despesa" className={`${styles.box_input_radio} ${styles.input_despesa}`}>
                            <Input type="radio" name="tipo" id="despesa" value="DESPESA" onChange={(e) => setTipo(e.target.value)} checked={tipo === "DESPESA"} />
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
                        {subcategorias <= 0 ? "" :
                            <Select
                                options={subcategorias.map(sub => ({ value: sub.id, label: sub.name }))}
                                value={subcategoriaSelecionada}
                                onChange={(e) => setSubcategoriaSelecionada(e.target.value)}
                                placeholder="Selecione a subcategoria"
                            />}

                    </div>

                    <div className={styles.box_btn_button}>
                        <Button type="submit"><span><PiIcons.PiPlusBold /></span> Incluir lançamento</Button>
                    </div>

                </form>

            </div>
        </div>

    ) : "";
}
