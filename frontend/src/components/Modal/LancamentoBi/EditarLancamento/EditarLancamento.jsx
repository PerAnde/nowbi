import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '../../../Input/Input';
import { Button } from '../../../Button/Button';
import { SelectCategoria } from '../../../Selects/SelectCategoria';
import { SelectSubcategoria } from '../../../Selects/SelectSubcategoria';
import * as PiIcons from 'react-icons/pi';
import styles from '../../Modal.module.scss';
import { buscarLancamento } from '../../../../services/lancamentos';
import { editarLancamento } from '../../../../services/lancamentos';
import { formatarValor, removerFormatacaoMoeda } from '../../../../utils/formatUtils'

export const EditarLancamento = ({ trigger, setTrigger, lancamento, empresaId, lancamentoEditado }) => {

    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState(null);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchLancamento = async () => {
            if (!trigger || !lancamento) return;

            const response = await buscarLancamento(lancamento);

            if (response) {
                setValor(formatarValor(Number(response.valor)));
                setTipo(response.tipo);
                setCategoriaSelecionada(response.categoria_id);
                setSubcategoriaSelecionada(response.subcategoria?.id || '');

                setTimeout(() => {
                    setSubcategoriaSelecionada(response.subcategoria_id);
                }, 200);
            }

        };

        fetchLancamento();
    }, [trigger, lancamento]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        const valorNumerico = removerFormatacaoMoeda(valor);

        const success = await editarLancamento(
            valorNumerico,
            tipo,
            categoriaSelecionada,
            subcategoriaSelecionada,
            lancamento
        );

        if (success) {
            setTrigger(false);
            setValor("");
            setTipo("");
            setCategoriaSelecionada("");
            setSubcategoriaSelecionada("");
            lancamentoEditado();
        }

        setLoading(false)
    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Editar Lançamento</h3>
                    <span onClick={() => {
                        setTrigger(false);
                        setCategoriaSelecionada("");
                        setSubcategoriaSelecionada("");
                    }}>
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
                                empresaId={empresaId}
                                categoriaSelecionada={categoriaSelecionada}
                                setCategoriaSelecionada={setCategoriaSelecionada}
                            />
                        </div>

                        <div className={styles.box_select}>
                            <SelectSubcategoria
                                categoriaSelecionada={categoriaSelecionada}
                                empresaId={empresaId}
                                subcategoriaSelecionada={subcategoriaSelecionada}
                                setSubcategoriaSelecionada={setSubcategoriaSelecionada}
                            />
                        </div>
                    </div>

                    <div className={styles.box_btn_button}>
                        <Button type="submit" loading={loading}>Salvar alterações</Button>
                    </div>

                </form>
            </div >
        </div >
    ) : '';
};
