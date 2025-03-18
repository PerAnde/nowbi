import React from 'react'
import { useMeses } from '../../hooks/useMeses';
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'

export const SelectMes = ({ mesSelecionado, setMesSelecionado }) => {

    // Buscando meses
    const { meses } = useMeses();

    const handleMes = (e) => {
        setMesSelecionado(e.value);
    }

    const mesOptions = meses.map(mes => ({
        value: mes.value,
        label: mes.value
    }))

    const selectedOptionMes = mesOptions.find(e => e.value === mesSelecionado);
    
    return (
        <Select
            options={mesOptions}
            value={selectedOptionMes}
            onChange={handleMes}
            placeholder="Selecione um mês"
            unstyled
            styles={customSelectStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />
    )
}
