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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await criarBi(id, mesSelecionado, Number(anoSelecionado));

        if (success) {
            setMesSelecionado("");
            setAnoSelecionado("");
            setTrigger(false);
            biCriado();
        }

    };

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
                            <Button type="submit">Cadastrar</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

    ) : "";
}
