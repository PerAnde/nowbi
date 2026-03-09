import React from 'react'

import { capitalizeFirstLetter } from '../../../utils/formatUtils'

import * as PiIcons from 'react-icons/pi';

import styles from '../Modal.module.scss'
import stylesInfosDetalhesBi from './InfosDetalhesBi.module.scss'

export const InfosDetalhesBi = ({ trigger, setTrigger, dadosCard, frase }) => {

    if (!trigger || !dadosCard || !dadosCard.dados || !dadosCard.dados.categorias) return "";

    const categorias = dadosCard.dados.categorias;

    const totalGrupo = Object.values(categorias).reduce(
        (acc, categoria) => acc + (categoria.total || 0),
        0
    );

    const quantidadeCategorias = Object.keys(categorias).length;

    const quantidadeSubcategorias = Object.values(categorias).reduce(
        (acc, categoria) => acc + Object.keys(categoria.subcategorias || {}).length,
        0
    );

    return trigger ? (

        <div className={styles.popup}>
            <div className={`${styles.box_popup} ${styles.box_popup_dashboard_bi}`}>
                <div className={styles.box_header}>
                    <h3>{dadosCard.titulo}</h3>
                    <span onClick={() => { setTrigger(false) }}>
                        <PiIcons.PiXBold className={styles.close} />
                    </span>
                </div>
                <div className={styles.box_frase_popup}>
                    {frase && (
                        <p className="frase_explicativa">{frase}</p>
                    )}
                </div>
                <div className={stylesInfosDetalhesBi.box_infos_dados}>
                    <div className={stylesInfosDetalhesBi.infos_dados}>
                        <p>Categorias</p>
                        <h3>
                            {quantidadeCategorias}
                        </h3>
                    </div>
                    <div className={stylesInfosDetalhesBi.infos_dados}>
                        <p>Subcategorias</p>
                        <h3>
                            {quantidadeSubcategorias}
                        </h3>
                    </div>
                    <div className={stylesInfosDetalhesBi.infos_dados}>
                        <p>Total</p>
                        <h3>
                            {totalGrupo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </h3>
                    </div>
                </div>
                {dadosCard && (
                    <div className={stylesInfosDetalhesBi.box_dados}>
                        {/* Categorias */}
                        {Object.entries(dadosCard.dados.categorias)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([categoria, dados]) => (
                                <React.Fragment key={categoria}>
                                    <div className={stylesInfosDetalhesBi.box_categorias}>
                                        <p>{capitalizeFirstLetter(categoria)}</p>
                                        <p>{dados.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                    </div>

                                    {/* Subcategorias */}
                                    {Object.entries(dados.subcategorias)
                                        .sort(([a], [b]) => a.localeCompare(b))
                                        .map(([sub, valor]) => (
                                            <div key={sub} className={stylesInfosDetalhesBi.box_subcategorias}>
                                                <p><PiIcons.PiArrowElbowDownRight className="icone_subcategoria_dre" /> {capitalizeFirstLetter(sub)}</p>
                                                <p>{valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                            </div>
                                        ))}
                                </React.Fragment>
                            ))}
                    </div>
                )}
            </div>
        </div>

    ) : "";
}
