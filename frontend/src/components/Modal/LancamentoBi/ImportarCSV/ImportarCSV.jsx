import React, { useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { criarLancamento } from '../../../../services/lancamentos';

import { Input } from '../../../Input/Input'
import { Button } from '../../../Button/Button'

import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss'

export const ImportarCSV = ({ trigger, setTrigger }) => {

    // ID do BI
    const { id } = useParams();

    const [dragActive, setDragActive] = useState(false);
    const [arquivo, setArquivo] = useState(null);
    const inputRef = useRef(null);

    function handleArquivo(file) {
        if (!file) return;

        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            alert("Selecione um arquivo CSV válido.");
            return;
        }

        setArquivo(file);
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleArquivo(e.dataTransfer.files[0]);
        }
    }

    function handleImportar() {
        if (!arquivo) return alert("Selecione um arquivo primeiro.");
        onImport({ arquivo });
    }

    return trigger ? (

        <div className={styles.popup}>
            <div className={styles.popupInfos}>
                <div className={styles.box_btn_fechar}>
                    <h3>Importar CSV</h3>
                    <span onClick={() => { setTrigger(false) }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                <div
                    className={`${styles.dropArea} ${dragActive ? styles.dragActive : ""
                        }`}
                    onDragEnter={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current.click()}
                >
                    {arquivo ? (
                        <p>{arquivo.name}</p>
                    ) : (
                        <>
                            <PiIcons.PiFileCsvLight className={styles.icone_csv}/>
                            <p>Enviar .csv</p>
                        </>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept=".csv"
                        hidden
                        onChange={(e) => handleArquivo(e.target.files[0])}
                    />
                </div>

                <div className={styles.box_btn_button}>
                    <Button type="submit"><span><PiIcons.PiPlusBold /></span> Incluir lançamento</Button>
                </div>

            </div>
        </div>

    ) : "";
}
