import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../api/api';
import { importacaoBling, sincronizarCategoriasBling } from '../../../../services/importacaoBling';
import { Button } from '../../../Button/Button';
import { toast } from 'sonner';
import * as PiIcons from 'react-icons/pi';

import { Input } from '../../../Input/Input';

import styles from '../../Modal.module.scss'
import stylesImportacaoBling from './ImportacaoBling.module.scss'

// 1. Defina a função de formatar fora do componente para garantir o escopo
const formatarData = (d) => {
    const dia = String(d.getDate()).padStart(2, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${dia}/${m}/${d.getFullYear()}`;
};

export const ImportacaoBling = ({ trigger, setTrigger, empresaId, lancamentoCriado }) => {
    const { id } = useParams()

    const [loading, setLoading] = useState(false)
    const [etapa, setEtapa] = useState(0)
    const [resultado, setResultado] = useState(null)
    const [periodoTexto, setPeriodoTexto] = useState("")
    const [datasAutomáticas, setDatasAutomáticas] = useState({ inicio: "", fim: "" })

    const [contasBling, setContasBling] = useState([])
    const [contasSelecionadas, setContasSelecionadas] = useState([])
    const [buscandoContas, setBuscandoContas] = useState(false)

    // console.log(contasSelecionadas)

    useEffect(() => {
        if (trigger && id) {
            const carregarDadosIniciais = async () => {
                setBuscandoContas(true);
                try {
                    // 1. Carrega dados do BI
                    const resBI = await api.get(`/bi/${id}`);
                    const { mes, ano } = resBI.data;

                    const mesesMap = {
                        'JANEIRO': 0, 'FEVEREIRO': 1, 'MARÇO': 2, 'ABRIL': 3,
                        'MAIO': 4, 'JUNHO': 5, 'JULHO': 6, 'AGOSTO': 7,
                        'SETEMBRO': 8, 'OUTUBRO': 9, 'NOVEMBRO': 10, 'DEZEMBRO': 11
                    };

                    const mesIndex = mesesMap[mes.toUpperCase()];
                    const dataInicio = new Date(ano, mesIndex, 1);
                    const dataFim = new Date(ano, mesIndex + 1, 0);

                    const resDatas = {
                        inicio: formatarData(dataInicio),
                        fim: formatarData(dataFim)
                    };

                    setDatasAutomáticas(resDatas);
                    setPeriodoTexto(`${mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase()} de ${ano}`);

                    // 2. Busca as contas do Bling
                    const resContas = await api.get(`/integrations/bling/contas/${empresaId}`);

                    if (resContas.data) {
                        setContasBling(resContas.data);
                        setContasSelecionadas(resContas.data.map(c => c.id));
                    }

                } catch (error) {
                    console.error("ERRO DETALHADO:", error);
                    toast.error("Erro ao carregar dados iniciais.");
                } finally {
                    setBuscandoContas(false);
                }
            };
            carregarDadosIniciais();
        }
    }, [trigger, id, empresaId]);

    const toggleConta = (contaId) => {
        setContasSelecionadas(prev =>
            prev.includes(contaId) ? prev.filter(id => id !== contaId) : [...prev, contaId]
        );
    };

    async function handleIniciarSincronizacao() {
        setLoading(true);
        setResultado(null)

        try {

            setEtapa(1);
            await sincronizarCategoriasBling(empresaId)

            await new Promise(res => setTimeout(res, 500));

            setEtapa(2);
            const data = await importacaoBling(
                empresaId,
                id,
                datasAutomáticas.inicio,
                datasAutomáticas.fim,
                contasSelecionadas
            );

            await new Promise(res => setTimeout(res, 500));

            setResultado(data);
            setEtapa(3);

            if (lancamentoCriado) lancamentoCriado();
            toast.success("Sincronização concluída!");

        } catch (error) {
            setEtapa(0);
            toast.error(error.response?.data?.error || "Erro na integração.");
        } finally {
            setLoading(false);
        }
    }

    const handleFecharModal = () => {
        if (loading) return
        setTrigger(false)
        setEtapa(0)
        setResultado(null)
    }

    return trigger ? (
        <div className={styles.popup}>
            <div className={styles.box_popup}>
                <div className={styles.box_header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3>Importação via Bling</h3>
                    </div>
                    <span onClick={handleFecharModal}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>

                {etapa === 0 && (
                    <>
                        <div className={styles.box_observacoes}>
                            <p>Importação para <strong>{periodoTexto}</strong></p>
                            <p>Selecione as contas financeiras que deseja importar:</p>
                        </div>

                        <div className={stylesImportacaoBling.secaoContas}>
                            {buscandoContas ? (
                                <div className={stylesImportacaoBling.loaderPequeno}>Carregando contas...</div>
                            ) : (
                                <div className={stylesImportacaoBling.listaContas}>
                                    {contasBling.length > 0 ? (
                                        contasBling.map(conta => (
                                            <label key={conta.id} className={styles.checkbox_confirmar}>
                                                <Input
                                                    type="checkbox"
                                                    checked={contasSelecionadas.includes(conta.id)}
                                                    onChange={() => toggleConta(conta.id)}
                                                    className={styles.input_checkbox}
                                                    style={{ display: 'none' }}
                                                />
                                                <span className={styles.custom_checkbox}>
                                                    <PiIcons.PiCheckFatFill className={styles.custom_icon} />
                                                </span>
                                                <p>{conta.descricao}</p>
                                            </label>
                                        ))
                                    ) : (
                                        <small>Nenhuma conta encontrada no Bling.</small>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={styles.box_btn_button}>
                            <Button
                                onClick={handleIniciarSincronizacao}
                                disabled={contasSelecionadas.length === 0 || buscandoContas}
                            >
                                Importar Agora
                            </Button>
                        </div>
                    </>
                )}

                {loading && (
                    <div className={stylesImportacaoBling.containerProgresso}>
                        <div className={stylesImportacaoBling.linhaProgresso}>
                            <div className={`${stylesImportacaoBling.ponto} ${etapa >= 1 ? stylesImportacaoBling.ativo : ""}`}>
                                <div className={stylesImportacaoBling.circulo}>
                                    {etapa > 1 ? <PiIcons.PiCheckBold /> : (etapa === 1 ? <PiIcons.PiCircleNotchBold className={stylesImportacaoBling.spinner} /> : "1")}
                                </div>
                                <span>Sincronizando Categorias</span>
                            </div>

                            <div className={stylesImportacaoBling.divisor}></div>

                            <div className={`${stylesImportacaoBling.ponto} ${etapa >= 2 ? stylesImportacaoBling.ativo : ""}`}>
                                <div className={stylesImportacaoBling.circulo}>
                                    {etapa > 2 ? <PiIcons.PiCheckBold /> : (etapa === 2 ? <PiIcons.PiCircleNotchBold className={stylesImportacaoBling.spinner} /> : "2")}
                                </div>
                                <span>Importando Lançamentos</span>
                            </div>

                            <div className={stylesImportacaoBling.divisor}></div>

                            <div className={`${stylesImportacaoBling.ponto} ${etapa >= 3 ? stylesImportacaoBling.ativo : ""}`}>
                                <div className={stylesImportacaoBling.circulo}>
                                    {etapa === 3 ? <PiIcons.PiCheckBold /> : "3"}
                                </div>
                                <span>Concluído</span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ETAPA 3: RESUMO FINAL (IGUAL AO CSV) */}
                {etapa === 3 && resultado && (
                    <div className={stylesImportacaoBling.containerResumo}>
                        <div className={stylesImportacaoBling.cardSucesso}>
                            <div className={stylesImportacaoBling.aviso}>
                                <PiIcons.PiCheckCircle size={20} color="var(--verde)" />
                                <p>{resultado.stats?.total_importados || 0} Lançamentos importados com sucesso!</p>
                            </div>
                            {(resultado.stats?.total_ignorados > 0) && (
                                <div className={stylesImportacaoBling.aviso}>
                                    <PiIcons.PiInfo size={20} color='var(--laranja)' />
                                    <p className={stylesImportacaoBling.aviso_ignorados}>{resultado.stats?.total_ignorados} Lançamentos ignorados.</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.box_btn_button}>
                            <Button onClick={handleFecharModal}>Concluir e Fechar</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : ""
}