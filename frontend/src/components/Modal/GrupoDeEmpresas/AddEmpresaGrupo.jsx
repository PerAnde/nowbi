import React, { useState, useEffect } from 'react';
import { atualizarEmpresaNoGrupo, buscarGrupos } from '../../../services/grupoEmpresas';

import { SelectGrupoEmpresa } from '../../Selects/SelectGrupoEmpresa';
import { Button } from '../../Button/Button';

import * as PiIcons from 'react-icons/pi';

import styles from '../Modal.module.scss';

export const AddEmpresaGrupo = ({ trigger, setTrigger, empresa }) => {

    const [grupos, setGrupos] = useState([]);
    const [grupoSelecionado, setGrupoSelecionado] = useState(null);
    const [acao, setAcao] = useState("adicionar")

    useEffect(() => {
        buscarGrupos(setGrupos)
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await atualizarEmpresaNoGrupo(grupoSelecionado, empresa, acao, setTrigger)

        if (success) {
            setGrupoSelecionado(null);
            setTrigger(false);
        }

    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Adicionar ao grupo</h3>
                    <span onClick={() => { setTrigger(false); setGrupoSelecionado(null) }}>
                        <PiIcons.PiXBold
                            className={styles.close}
                        />
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form_cadastro_empresa}>

                    <div className={`${styles.box_componente} ${styles.box_infos_cadastro}`}>
                        <SelectGrupoEmpresa
                            grupoSelecionado={grupoSelecionado}
                            setGrupoSelecionado={setGrupoSelecionado}
                            grupos={grupos}
                        />

                        <div className={styles.box_btn_button}>
                            <Button type="submit">Salvar alterações</Button>
                        </div>
                    </div>

                </form>

            </div>
        </div>
    ) : null;
};
