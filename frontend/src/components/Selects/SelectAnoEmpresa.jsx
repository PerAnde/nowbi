import React from 'react'
import { useAnos } from '../../hooks/useAnos';
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'

export const SelectAnoEmpresa = ({ anoSelecionado, setAnoSelecionado, anosDisponiveis }) => {

    const handleAno = (e) => {
        setAnoSelecionado(e.value);
    }

    const anoOptions = anosDisponiveis.map(ano => ({
        value: ano,
        label: String(ano)
    }));

    const selectedOptionAno = anoOptions.find(e => e.value === anoSelecionado);

    return (
        <Select
            options={anoOptions}
            value={selectedOptionAno}
            onChange={handleAno}
            placeholder="Selecione um ano"
            unstyled
            styles={customSelectStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />
    )
}
