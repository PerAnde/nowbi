import React from 'react'
import { useAnos } from '../../hooks/useAnos';
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'

export const SelectAno = ({ anoSelecionado, setAnoSelecionado }) => {

    // Buscando meses
    const { anos } = useAnos();

    const handleAno = (e) => {
        setAnoSelecionado(e.value);
    }

    const anoOptions = anos.map(ano => ({
        value: ano.value,
        label: ano.value
    }))
    
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
