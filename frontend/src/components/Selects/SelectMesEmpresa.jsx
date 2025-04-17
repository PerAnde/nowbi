import React from 'react'
import { useMeses } from '../../hooks/useMeses';
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'

export const SelectMesEmpresa = ({ mesSelecionado, setMesSelecionado, mesesDisponiveis }) => {

    const handleMes = (e) => {
        setMesSelecionado(e.value);
    }

    const mesOptions = mesesDisponiveis.map(mes => ({
        value: mes,
        label: mes.charAt(0).toUpperCase() + mes.slice(1)
    }));

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
