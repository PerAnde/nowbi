import React from 'react';
import * as PiIcons from 'react-icons/pi';
import { capitalizeFirstLetter } from '../../../../utils/formatUtils';

import './DfcTabela.css';

export const DfcMensal = ({ dadosFiltrados, summary, abertos, toggleLinha }) => {
    return (
        <div className="box_dfc">
            <table className="tabela_dfc">
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Total (R$)</th>
                        <th>A.V.</th>
                    </tr>
                </thead>

                <tbody>
                    {dadosFiltrados.map((grupo, idx) => {
                        const idGrupo = `grupo-${idx}`;
                        const estaAberto = abertos[idGrupo];

                        const temCategorias = grupo.dados.categorias && Object.keys(grupo.dados.categorias).length > 0;

                        return (
                            <React.Fragment key={idx}>
                                <tr
                                    className="linha_grupo"
                                    onClick={() => temCategorias && toggleLinha(idGrupo)}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: 'var(--background-geral)',
                                        fontWeight: 'var(--font-medium)'
                                    }}
                                >
                                    <td className="linha_grupo_dfc" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                                        {temCategorias ? (
                                            estaAberto ? <PiIcons.PiCaretDown /> : <PiIcons.PiCaretRight />
                                        ) : (
                                           ''
                                        )}
                                        <strong> {grupo.titulo}</strong>
                                    </td>
                                    <td className='linha_total_grupo' style={{ textAlign: 'right', fontWeight: 'var(--font-bold)' }}>
                                        {grupo.dados.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="coluna_av" style={{ textAlign: 'right', fontWeight: 'var(--font-bold)' }}>
                                        {((grupo.dados.total / summary.receitas) * 100).toFixed(2)}%
                                    </td>
                                </tr>

                                {estaAberto && Object.entries(grupo.dados.categorias)
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([categoria, dados]) => {
                                        const idCat = `cat-${idx}-${categoria}`;
                                        const catAberta = abertos[idCat];

                                        return (
                                            <React.Fragment key={categoria}>
                                                <tr className="linha_categoria" onClick={() => toggleLinha(idCat)} style={{ cursor: 'pointer' }}>
                                                    <td className="linha_nome_categoria" style={{ display: 'flex', gap: '.5rem', alignItems: 'center', paddingLeft: '2rem' }}>
                                                        {catAberta ? <PiIcons.PiCaretDown /> : <PiIcons.PiCaretRight />}
                                                        {capitalizeFirstLetter(categoria)}
                                                    </td>
                                                    <td className="coluna_total" style={{ textAlign: 'right' }}>{dados.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                    <td className="coluna_av" style={{ textAlign: 'right' }}>{((dados.total / summary.receitas) * 100).toFixed(2)}%</td>
                                                </tr>

                                                {catAberta && Object.entries(dados.subcategorias)
                                                    .sort(([a], [b]) => a.localeCompare(b))
                                                    .map(([sub, valor]) => (
                                                        <tr className="linha_subcategoria">
                                                            <td className="linha_nome_subcategoria" style={{ color: 'var(--texto-secundario)', paddingLeft: '3rem' }}><PiIcons.PiArrowElbowDownRightLight /> {capitalizeFirstLetter(sub)}</td>
                                                            <td style={{ textAlign: 'right', color: 'var(--texto-secundario)' }}>{valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                            <td style={{ textAlign: 'right', color: 'var(--texto-secundario)' }}>{((valor / summary.receitas) * 100).toFixed(2)}%</td>
                                                        </tr>
                                                    ))}
                                            </React.Fragment>
                                        );
                                    })}

                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};