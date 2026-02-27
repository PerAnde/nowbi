import React from 'react'
import { useAnos } from '../../hooks/useAnos';
import Select from 'react-select'
import { customSelectBiStyles } from './customSelectBiStyles'

export const SelectAnoBi = ({ anoSelecionado, setAnoSelecionado, anosDisponiveis }) => {

    const handleAno = (e) => {
        setAnoSelecionado(e.value);
    }

    const anoOptions = anosDisponiveis.map(ano => ({
        value: ano,
        label: String(ano)
    }));

    const selectedOptionAno = anoOptions.find(e => String(e.value) === String(anoSelecionado));

    return (
        <Select
            options={anoOptions}
            value={selectedOptionAno}
            onChange={handleAno}
            placeholder="Selecione o Ano"
            unstyled
            styles={customSelectBiStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />
    )
}
