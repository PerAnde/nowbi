import React, { useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { importarCsv } from '../../../../services/importacaoCsv';
import { Button } from '../../../Button/Button'
import { toast } from 'sonner'

import * as PiIcons from 'react-icons/pi';

import styles from '../../Modal.module.scss'
import stylesImportarCSV from './ImportarCSV.module.scss'

export const ImportarCSV = ({ trigger, setTrigger, lancamentoCriado }) => {

    // ID do BI
    const { id } = useParams();

    const [dragActive, setDragActive] = useState(false);
    const [arquivo, setArquivo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [etapa, setEtapa] = useState(0);
    const [resultado, setResultado] = useState(null);
    const inputRef = useRef(null);

    function handleArquivo(file) {
        if (!file) return;
        const tiposPermitidos = ['text/csv', 'application/vnd.ms-excel'];
        const extensaoValida = file.name.toLowerCase().endsWith(".csv");

        if (!extensaoValida && !tiposPermitidos.includes(file.type)) {
            toast.error("Por favor, selecione um arquivo CSV válido.");
            return;
        }

        const tamanhoMaximo = 5 * 1024 * 1024;
        if (file.size > tamanhoMaximo) {
            toast.error("O arquivo é muito grande. O limite é 5MB.");
            return;
        }

        setArquivo(file);
    }

    async function handleImportar(e) {
        e.preventDefault();
        if (!arquivo) return toast.warn("Selecione um arquivo.");

        setLoading(true);
        try {
            setEtapa(1);
            await new Promise(res => setTimeout(res, 1000));

            setEtapa(2);
            const data = await importarCsv(arquivo, id);
            await new Promise(res => setTimeout(res, 1000));

            setEtapa(3);
            await new Promise(res => setTimeout(res, 1000));

            setResultado(data);
            setEtapa(4);

            if (lancamentoCriado) lancamentoCriado();

        } catch (error) {
            setEtapa(0);
            toast.error(error.error || "Erro na importação.");
        } finally {
            setLoading(false);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleArquivo(e.dataTransfer.files[0]);
        }
    }

    const handleFecharModal = () => {
        if (loading) return;

        setTrigger(false);
        setArquivo(null);
        setEtapa(0);
        setResultado(null);
    };

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.box_popup}>
                <div className={styles.box_header}>
                    <h3>Importar CSV</h3>
                    <span onClick={handleFecharModal}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                {etapa === 0 && (
                    <div className={styles.box_observacoes}>
                        <p>Envie o CSV de conciliação financeira.</p>
                    </div>
                )}

                {etapa === 4 && resultado ? (
                    <div className={stylesImportarCSV.containerResumo}>
                        <div className={stylesImportarCSV.cardSucesso}>
                            {resultado.duplicados > 0 ? (
                                <>
                                    <div className={stylesImportarCSV.aviso}>
                                        <PiIcons.PiCheckCircle size={20} color="var(--verde)" />
                                        <p>{resultado.importados} Novos lançamentos importados!</p>
                                    </div>
                                    <div className={stylesImportarCSV.aviso}>
                                        <PiIcons.PiInfo size={20} color='var(--laranja)' />
                                        <p className={stylesImportarCSV.infoDuplicados}>{resultado.duplicados} Lançamentos ignorados (já existentes).</p>
                                    </div>
                                </>
                            ) : (
                                <div className={stylesImportarCSV.aviso}>
                                    <PiIcons.PiCheckCircle size={20} color="var(--verde)" />
                                    <p>{resultado.importados} Lançamentos importados!</p>
                                </div>
                            )}
                        </div>

                        {resultado.naoImportados.length > 0 && (
                            <div className={stylesImportarCSV.boxNaoImportados}>
                                <div className={stylesImportarCSV.aviso}>
                                    <PiIcons.PiWarning size={20} />
                                    <p>{resultado.naoImportados.length} Lançamentos não importados:</p>
                                </div>
                                <div className={stylesImportarCSV.tabelaScroll}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Valor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resultado.naoImportados.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.subcategoriaNome}</td>
                                                    <td>R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className={stylesImportarCSV.dica}>Dica: Cadastre essas subcategorias na empresa e tente importar o arquivo novamente.</p>
                            </div>
                        )}

                        <div className={stylesImportarCSV.box_btn_button}>
                            <Button onClick={() => { setTrigger(false); setEtapa(0); setArquivo(null); }}>
                                Concluir e Fechar
                            </Button>
                        </div>
                    </div>

                ) : loading ? (
                    <div className={stylesImportarCSV.containerProgresso}>
                        <div className={stylesImportarCSV.linhaProgresso}>
                            <div className={`${stylesImportarCSV.ponto} ${etapa >= 1 ? stylesImportarCSV.ativo : ""}`}>
                                <div className={stylesImportarCSV.circulo}>{etapa > 1 ? <PiIcons.PiCheckBold /> : "1"}</div>
                                <span>Analisando</span>
                            </div>
                            <div className={stylesImportarCSV.divisor}></div>
                            <div className={`${stylesImportarCSV.ponto} ${etapa >= 2 ? stylesImportarCSV.ativo : ""}`}>
                                <div className={stylesImportarCSV.circulo}>{etapa > 2 ? <PiIcons.PiCheckBold /> : "2"}</div>
                                <span>Importando dados</span>
                            </div>
                            <div className={stylesImportarCSV.divisor}></div>
                            <div className={`${stylesImportarCSV.ponto} ${etapa >= 3 ? stylesImportarCSV.ativo : ""}`}>
                                <div className={stylesImportarCSV.circulo}>{etapa === 3 ? <PiIcons.PiCheckBold /> : "3"}</div>
                                <span>Concluído</span>
                            </div>
                        </div>
                    </div>

                ) : (
                    <>
                        <div
                            className={`${stylesImportarCSV.dropArea} ${dragActive ? stylesImportarCSV.dragActive : ""} ${arquivo ? stylesImportarCSV.hasFile : ""}`}
                            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current.click()}
                        >
                            {arquivo ? (
                                <div className={stylesImportarCSV.fileInfo}>
                                    <PiIcons.PiFileCsvLight size={30} color="var(--cor-principal)" />
                                    <p>Arquivo selecionado:</p>
                                    <strong>{arquivo.name}</strong>
                                </div>
                            ) : (
                                <>
                                    <PiIcons.PiFileCsvLight className={stylesImportarCSV.icone_csv} />
                                    <p>Clique ou arraste para enviar o arquivo .csv</p>
                                </>
                            )}
                            <input ref={inputRef} type="file" accept=".csv" hidden onChange={(e) => handleArquivo(e.target.files[0])} />
                        </div>

                        <div className={styles.box_btn_button}>
                            <button onClick={handleImportar} disabled={!arquivo}>Importar CSV</button>
                        </div>
                    </>
                )}

            </div>
        </div>
    ) : "";
}
