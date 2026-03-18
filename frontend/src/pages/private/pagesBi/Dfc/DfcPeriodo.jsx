import React from 'react';
import { capitalizeFirstLetter, formatarMesAno, formatarValorZerado } from '../../../../utils/formatUtils';

import './DfcTabela.css';
import * as PiIcons from 'react-icons/pi';

export const DfcPeriodo = ({ cabecalho, linhas, abertos, toggleLinha }) => {

    const linhaReceitaBruta = linhas.find(l => l.tipo === 'RECEITA_OPERACIONAL_BRUTA');

    const calcularTotal = (valores) => valores.reduce((acc, curr) => acc + curr, 0);

    const calcularAV = (valorLinha, baseAV) => {
        if (!baseAV || baseAV === 0) return "--";
        const percentual = (valorLinha / baseAV) * 100;
        return percentual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
    };

    return (
        <div className="box_dfc">
            <table className="tabela_dfc">
                <thead>
                    <tr>
                        <th>Descrição</th>
                        {cabecalho.map((mes, idx) => (
                            <th key={idx}>{capitalizeFirstLetter(formatarMesAno(mes))}</th>
                        ))}
                        <th>Total (R$)</th>
                        <th>A.V.</th>
                    </tr>
                </thead>

                <tbody>
                    {linhas.map((linha, idx) => {
                        const idGrupo = `grupo-${idx}`;
                        const estaAberto = abertos[idGrupo];
                        const totalLinha = calcularTotal(linha.valores);
                        const totalBaseAV = linhaReceitaBruta ? calcularTotal(linhaReceitaBruta.valores) : 0;

                        return (
                            <React.Fragment key={idx}>
                                <tr
                                    className="linha_grupo"
                                    onClick={() => !linha.isResultado && toggleLinha(idGrupo)}
                                    style={{
                                        cursor: linha.isResultado ? 'default' : 'pointer',
                                        backgroundColor: 'var(--background-geral)',
                                        fontWeight: 'var(--font-medium)'
                                        
                                    }}
                                >
                                    <td className="linha_grupo_dfc" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                                        {!linha.isResultado && (estaAberto ? <PiIcons.PiCaretDown /> : <PiIcons.PiCaretRight />)}
                                        <strong> {linha.titulo}</strong>
                                    </td>
                                    {linha.valores.map((valor, i) => (
                                        <td key={i} className='linha_total_grupo' style={{ textAlign: 'right' }}>
                                            {formatarValorZerado(valor)}
                                        </td>
                                    ))}
                                    <td className="coluna_total" style={{ textAlign: 'right' }}>
                                        <strong>{formatarValorZerado(totalLinha)}</strong>
                                    </td>
                                    <td className="coluna_av" style={{ textAlign: 'right'}}>
                                        <strong>{calcularAV(totalLinha, totalBaseAV)}</strong>
                                    </td>
                                </tr>

                                {estaAberto && !linha.isResultado && Object.entries(linha.categorias || {}).map(([catNome, catDados]) => {
                                    const idCat = `cat-${idx}-${catNome}`;
                                    const catAberta = abertos[idCat];
                                    const totalCat = calcularTotal(catDados.total);

                                    return (
                                        <React.Fragment key={catNome}>
                                            <tr className="linha_categoria" onClick={() => toggleLinha(idCat)} style={{ cursor: 'pointer' }}>
                                                <td className="linha_nome_categoria" style={{ display: 'flex', gap: '.5rem', alignItems: 'center', paddingLeft: '2rem' }}>
                                                    {catAberta ? <PiIcons.PiCaretDown /> : <PiIcons.PiCaretRight />} {capitalizeFirstLetter(catNome)}
                                                </td>
                                                {catDados.total.map((v, i) => (
                                                    <td key={i} style={{ textAlign: 'right' }}>{formatarValorZerado(v)}</td>
                                                ))}
                                                <td className="coluna_total" style={{ textAlign: 'right' }}>{formatarValorZerado(totalCat)}</td>
                                                <td className="coluna_av" style={{ textAlign: 'right' }}>{calcularAV(totalCat, totalBaseAV)}</td>
                                            </tr>

                                            {catAberta && catDados.subcategorias && catDados.subcategorias.map((sub, subIdx) => {
                                                const totalSub = calcularTotal(sub.valores);
                                                return (
                                                    <tr key={subIdx} className="linha_subcategoria">
                                                        <td className="linha_nome_subcategoria" style={{ color: 'var(--texto-secundario)', paddingLeft: '3rem' }}>
                                                            <PiIcons.PiArrowElbowDownRight /> {capitalizeFirstLetter(sub.nome)}
                                                        </td>
                                                        {sub.valores.map((v, i) => (
                                                            <td className='valor_subcategoria' style={{ color: 'var(--texto-secundario)', textAlign: 'right' }} key={i}>
                                                                {formatarValorZerado(v)}
                                                            </td>
                                                        ))}
                                                        <td style={{ textAlign: 'right', color: 'var(--texto-secundario)' }}>{formatarValorZerado(totalSub)}</td>
                                                        <td style={{ textAlign: 'right', color: 'var(--texto-secundario)' }}>{calcularAV(totalSub, totalBaseAV)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};