import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { criarBi } from '../../../../services/bis';

import { Select } from '../../../Select/Select'
import { Button } from '../../../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss'

export const CriarBi = ({ trigger, setTrigger, biCriado }) => {

    const [mes, setMes] = useState("");
    const [ano, setAno] = useState("");

    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await criarBi(id, mes, Number(ano));

        if (success) {
            setMes("");
            setAno("");
            setTrigger(false);
            biCriado();
        }

    };

    const meses = [
        { value: "JANEIRO", label: "Janeiro" },
        { value: "FEVEREIRO", label: "Fevereiro" },
        { value: "MARÇO", label: "Março" },
        { value: "ABRIL", label: "Abril" },
        { value: "MAIO", label: "Maio" },
        { value: "JUNHO", label: "Junho" },
        { value: "JULHO", label: "Julho" },
        { value: "AGOSTO", label: "Agosto" },
        { value: "SETEMBRO", label: "Setembro" },
        { value: "OUTUBRO", label: "Outubro" },
        { value: "NOVEMBRO", label: "Novembro" },
        { value: "DEZEMBRO", label: "Dezembro" },
    ];

    const anos = Array.from({ length: 101 }, (_, i) => 2000 + i).map((year) => ({
        value: year,
        label: year,
    }));

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Novo Bi</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>
                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>

                        <div className={styles.box_selects}>
                            <Select
                                options={meses}
                                value={mes}
                                onChange={(e) => setMes(e.target.value)}
                                placeholder="Selecione o mês"
                            />

                            <Select
                                options={anos}
                                value={ano}
                                onChange={(e) => setAno(e.target.value)}
                                placeholder="Selecione o ano"
                            />
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
