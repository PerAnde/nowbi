import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { buscarBi, excluirBi } from '../../../services/bis';
import { buscarEmpresa } from '../../../services/empresas';

import { Layout } from '../../../layout/Layout'

import { EditarBi } from '../../../components/Modal/BI/EditarBi/EditarBi';
import { ExcluirBi } from '../../../components/Modal/BI/ExcluirBi/ExcluirBi';

import { Input } from '../../../components/Input/Input';
import { Select } from '../../../components/Select/Select';
import { Button } from '../../../components/Button/Button';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Estilos do Skeleton

import * as PiIcons from 'react-icons/pi';

import styles from './Bi.module.scss'

export const Bi = () => {

    // Estados BI e Empresa
    const { id } = useParams();
    const [bi, setBi] = useState({});
    const [empresa, setEmpresa] = useState();
    const [loading, setLoading] = useState(true);

    // Estados incluri Lancamento
    const [novoLancamentoValor, setNovoLancamentoValor] = useState('')
    const [tipo, setTipo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [subcategoria, setSubcategoria] = useState("");

    const [popUpEditarBi, setPopUpEditarBi] = useState(false);
    const [popUpExcluirBi, setPopUpExcluirBi] = useState(false);

    const categorias = [
        { value: "JANEIRO", label: "Janeiro" },
        { value: "FEVEREIRO", label: "Fevereiro" },
        { value: "MARÇO", label: "Março" },
    ];

    const subcategorias = [
        { value: "Bla", label: "Janeiro" },
        { value: "bu", label: "Fevereiro" },
        { value: "jet", label: "Março" },
    ];

    const navigate = useNavigate();

    useEffect(() => {
        if (popUpEditarBi) {
            document.body.style.overflow = 'hidden'; // Desativa o scroll
        } else {
            document.body.style.overflow = 'auto'; // Restaura o scroll
        }
    }, [popUpEditarBi]);

    useEffect(() => {
        buscarBi(id, setBi, setLoading, navigate)
    }, [id])

    useEffect(() => {
        if (bi?.empresa_id) {
            buscarEmpresa(bi?.empresa_id, setEmpresa, setLoading, navigate)
        }
    }, [bi])

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Formata valor do input
    const formatarValor = (valor) => {
        // Remove tudo que não é número
        valor = valor.replace(/\D/g, "");

        // Converte para número e formata para reais
        valor = (Number(valor) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        return valor;
    };

    // Excluir BI
    const confirmarExclusao = async () => {
        excluirBi(id);
    }

    return (
        <Layout>
            <div className="box_conteudo_paginas">

                <div className="header-paginas">

                    <div className="box-header">
                        {loading ? (
                            <Skeleton width={200} height={25} borderRadius={6} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                        ) : (
                            <h2>
                                <span>{capitalizeFirstLetter(bi.mes)} / {bi.ano}</span>
                                <p className={`${styles.box_status_bi} ${bi.status ? styles.bi_concluido : styles.bi_em_progresso}`}>{bi.status ? "Concluído" : "Em progresso"}</p>
                            </h2>
                        )}

                        <div className={styles.box_menu_pagina}>
                            <Link to='/dashboard' className={styles.link_menu_pagina}>Dashboard</Link>
                            <PiIcons.PiDotOutlineFill />
                            <Link to='/empresas' className={styles.link_menu_pagina}>Empresas</Link>
                            <PiIcons.PiDotOutlineFill />
                            <Link to={`/empresas/${bi?.empresa_id}`} className={styles.link_menu_pagina}>{empresa?.name}</Link>
                            <PiIcons.PiDotOutlineFill />
                            <p className={styles.link_menu_pagina_atual}>
                                {loading ? (
                                    <Skeleton width={120} height={15} borderRadius={6} baseColor='rgb(170, 170, 170, .1)' highlightColor='rgb(232, 235, 239, .2)' />
                                ) : (
                                    <span>{capitalizeFirstLetter(bi.mes)} / {bi.ano}</span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="box-header">
                        <div className="box-header-btns">
                            <Link className={`${styles.btn_link_principal} ${styles.btn_editar}`} onClick={() => setPopUpEditarBi(true)}><PiIcons.PiNotePencilBold />Editar </Link>
                            <Link className={`${styles.btn_link_principal} ${styles.btn_excluir}`} onClick={() => setPopUpExcluirBi(true)}><PiIcons.PiTrashBold /> Excluir</Link>
                            <Link className={`${styles.btn_link_principal} ${styles.btn_concluir}`}><PiIcons.PiChecksBold /> Concluir BI</Link>
                        </div>
                    </div>

                </div>

                <form className={styles.box_incluir_lancamento}>

                    <div className={styles.box_inputs}>
                        <Input type="text" placeholder="R$ 0,00" value={novoLancamentoValor} onChange={(e) => setNovoLancamentoValor(formatarValor(e.target.value))} />
                    </div>

                    <div className={styles.box_inputs}>
                        <label htmlFor="receita" className={`${styles.box_input_radio} ${styles.input_receita}`} >
                            <Input type="radio" name="tipo" id="receita" value="RECEITA" onChange={(e) => setTipo(e.target.value)} />
                            <label htmlFor="receita"><span><PiIcons.PiTrendUpBold /></span> Receita</label>
                        </label>
                    </div>

                    <div className={styles.box_inputs}>
                        <label htmlFor="despesa" className={`${styles.box_input_radio} ${styles.input_despesa}`}>
                            <Input type="radio" name="tipo" id="despesa" value="DESPESA" onChange={(e) => setTipo(e.target.value)} />
                            <label htmlFor="despesa"><span><PiIcons.PiTrendDownBold /></span> Despesa</label>
                        </label>
                    </div>

                    <div className={styles.box_inputs}>
                        <Select
                            options={categorias}
                            value={categoria}
                            onChange={(e) => setMes(e.target.value)}
                            placeholder="Selecione a categoria"
                        />
                    </div>

                    <div className={styles.box_inputs}>
                        <Select
                            options={subcategorias}
                            value={subcategoria}
                            onChange={(e) => setMes(e.target.value)}
                            placeholder="Selecione a subcategoria"
                        />
                    </div>

                    <div className={styles.box_inputs}>
                        <Button type="submit"><span><PiIcons.PiPlusBold /></span></Button>
                    </div>

                </form>

                <div className={styles.box_menu_lancamentos}>
                    <div className={styles.filtro_pagina}>
                        <Link className={`${styles.filtro_receitas} ${styles.ativo}`}>
                            <PiIcons.PiArrowUpRightBold />
                            Receitas
                        </Link>
                        <Link className={styles.filtro_despesas}>
                            <PiIcons.PiArrowDownRightBold />
                            Despesas
                        </Link>
                    </div>
                </div>

            </div>

            <EditarBi trigger={popUpEditarBi} setTrigger={setPopUpEditarBi} />
            <ExcluirBi
                trigger={popUpExcluirBi}
                setTrigger={setPopUpExcluirBi}
                mensagem={<>Todos os dados desse <strong>BI</strong> serão <strong>excluídos permanentemente!</strong></>}
                onConfirm={confirmarExclusao}
            />

        </Layout>
    )
}
