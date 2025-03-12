import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { Input } from '../../../Input/Input';
import { Button } from '../../../Button/Button';
import { Select } from '../../../Select/Select';
import * as PiIcons from 'react-icons/pi';
import styles from '../../Modal.module.scss';
import { buscarCategorias, buscarCategoria } from '../../../../services/categorias';

export const EditarLancamento = ({ trigger, setTrigger, lancamento, lancamentoEditado }) => {

    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
    const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState('');

    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    const [alterarCategoria, setAlterarCategoria] = useState(true);

    // Atualizando os valores dos estados com o lançamento
    useEffect(() => {
        if (lancamento) {
            setValor(lancamento.valor || '');
            setTipo(lancamento.tipo || '');
            setCategoriaSelecionada(lancamento.categoria || '');
            setSubcategoriaSelecionada(lancamento.subcategoria || '');
        }
    }, [lancamento]);

    // Buscando todas as categorias
    useEffect(() => {
        buscarCategorias(setCategorias, setLoading);
    }, []);

    // Filtrando select de categorias pelo tipo RECEITA ou DESPESA
    const categoriasFiltradosPorTipo = categorias.filter(categoria => categoria.tipo === tipo);

    // Atualiza as subcategorias quando uma categoria é buscada
    useEffect(() => {
        if (categoriaSelecionada) {
            buscarCategoria(categoriaSelecionada, setCategoria, setLoading);
        }
    }, [categoriaSelecionada]);

    useEffect(() => {
        if (categoria && categoria.subcategorias) {
            setSubcategorias(categoria.subcategorias);
        } else {
            setSubcategorias([]);
        }
    }, [categoria]);

    // Formata campo valor
    const formatarValor = (valor) => {
        valor = valor.replace(/\D/g, '');
        valor = (Number(valor) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return valor;
    };

    // Removendo formatação para enviar para a API
    const removerFormatacaoMoeda = (valor) => {
        return Number(valor.replace(/[^0-9,-]+/g, '').replace(',', '.'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const valorNumerico = removerFormatacaoMoeda(valor);

        console.log(valorNumerico, tipo, categoriaSelecionada, subcategoriaSelecionada)
    }

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Editar Lançamento</h3>
                    <span onClick={() => { setTrigger(false); }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <Input
                        type="text"
                        placeholder="R$ 0,00"
                        value={valor}
                        onChange={(e) => setValor(formatarValor(e.target.value))}
                    />

                    {alterarCategoria ? (
                        <Link onClick={() => setAlterarCategoria(false)}>Alterar categoria</Link>
                    ) : (
                        <>
                            <div className={styles.box_inputs}>
                                <label htmlFor="receita" className={`${styles.box_input_radio} ${styles.input_receita}`}>
                                    <Input
                                        type="radio"
                                        name="tipo"
                                        id="receita"
                                        value="RECEITA"
                                        onChange={(e) => setTipo(e.target.value)}
                                        checked={tipo === 'RECEITA'}
                                    />
                                    <label htmlFor="receita">
                                        <span><PiIcons.PiTrendUpBold /></span> Receita
                                    </label>
                                </label>

                                <label htmlFor="despesa" className={`${styles.box_input_radio} ${styles.input_despesa}`}>
                                    <Input
                                        type="radio"
                                        name="tipo"
                                        id="despesa"
                                        value="DESPESA"
                                        onChange={(e) => setTipo(e.target.value)}
                                        checked={tipo === 'DESPESA'}
                                    />
                                    <label htmlFor="despesa">
                                        <span><PiIcons.PiTrendDownBold /></span> Despesa
                                    </label>
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
                                {subcategorias.length === 0 ? "" : (
                                    <Select
                                        options={subcategorias.map(sub => ({ value: sub.id, label: sub.name }))}
                                        value={subcategoriaSelecionada}
                                        onChange={(e) => setSubcategoriaSelecionada(e.target.value)}
                                        placeholder="Selecione a subcategoria"
                                    />
                                )}
                            </div>
                        </>
                    )}

                    <div className={styles.box_btn_button}>
                        <Button type="submit">Salvar alterações</Button>
                    </div>
                </form >
            </div >
        </div >
    ) : '';
};
