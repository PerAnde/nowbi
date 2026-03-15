import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../api/api';
import { importacaoBling } from '../../../../services/importacaoBling';
import { Button } from '../../../Button/Button';
import { toast } from 'sonner';
import * as PiIcons from 'react-icons/pi';

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

    console.log(contasSelecionadas)

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
        try {
            setEtapa(1);
            const data = await importacaoBling(
                empresaId,
                id,
                datasAutomáticas.inicio,
                datasAutomáticas.fim,
                contasSelecionadas
            );

            console.log(data.stats.detalhes_importacao);

            setEtapa(2);
            await new Promise(res => setTimeout(res, 800));

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
                    <div className={stylesImportacaoBling.containerConfirmacao}>
                        <div className={styles.box_observacoes}>
                            <p>Importação para <strong>{periodoTexto}</strong></p>
                        </div>

                        <div className={stylesImportacaoBling.secaoContas}>
                            <p style={{ fontSize: '0.9rem', marginBottom: '10px', fontWeight: 'bold' }}>
                                Selecione as contas financeiras:
                            </p>
                            {buscandoContas ? (
                                <div className={stylesImportacaoBling.loaderPequeno}>Carregando contas...</div>
                            ) : (
                                <div className={stylesImportacaoBling.listaContas}>
                                    {contasBling.length > 0 ? (
                                        contasBling.map(conta => (
                                            <label key={conta.id} className={stylesImportacaoBling.itemConta}>
                                                <input
                                                    type="checkbox"
                                                    checked={contasSelecionadas.includes(conta.id)}
                                                    onChange={() => toggleConta(conta.id)}
                                                />
                                                <span>{conta.descricao}</span>
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
                                loading={loading}
                                disabled={contasSelecionadas.length === 0 || buscandoContas}
                            >
                                <PiIcons.PiCloudArrowDown /> Importar Agora
                            </Button>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className={stylesImportacaoBling.containerProgresso}>
                        <div className={stylesImportacaoBling.loader}></div>
                        <p>{etapa === 1 ? "Sincronizando Categorias..." : "Importando Lançamentos..."}</p>
                        <small>Isto pode demorar alguns segundos conforme o volume de dados.</small>
                    </div>
                )}

                {etapa === 3 && resultado && (
                    <div className={stylesImportacaoBling.containerResumo}>
                        <div className={stylesImportacaoBling.cardSucesso}>
                            <PiIcons.PiCheckCircleFill size={40} color="var(--verde)" />
                            <h3>Sincronização Concluída!</h3>
                            <div className={stylesImportacaoBling.gridStats}>
                                <div>
                                    <strong>{resultado.stats?.total_importados || 0}</strong>
                                    <span>Importados</span>
                                </div>
                                <div>
                                    <strong>{resultado.stats?.total_ignorados || 0}</strong>
                                    <span>Ignorados</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.box_btn_button}>
                            <Button onClick={handleFecharModal}>Voltar para o BI</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : ""
}