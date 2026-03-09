import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { criarBi } from '../../../../services/bis';
import { SelectMes } from '../../../Selects/SelectMes';
import { SelectAno } from '../../../Selects/SelectAno';

import { Button } from '../../../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss'

export const CriarBi = ({ trigger, setTrigger, biCriado }) => {

    // ID da empresa
    const { id } = useParams();
    // Estados Selecionados
    const [mesSelecionado, setMesSelecionado] = useState("");
    const [anoSelecionado, setAnoSelecionado] = useState("");
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        const success = await criarBi(id, mesSelecionado, Number(anoSelecionado));

        if (success) {
            setMesSelecionado("");
            setAnoSelecionado("");
            setTrigger(false);
            biCriado();
        }

        setLoading(false)

    };

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.box_popup}>
                <div className={styles.box_header}>
                    <h3>Novo Bi</h3>
                    <span onClick={() => setTrigger(false)}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.box_form}>
                    <div className={styles.box_infos}>

                        <div className={styles.box_selects}>
                            <SelectMes
                                mesSelecionado={mesSelecionado}
                                setMesSelecionado={setMesSelecionado}
                            />
                            <SelectAno
                                anoSelecionado={anoSelecionado}
                                setAnoSelecionado={setAnoSelecionado}
                            />
                        </div>

                        <div className={styles.box_btn_button}>
                            <Button type="submit" loading={loading}>Cadastrar</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

    ) : "";
}
