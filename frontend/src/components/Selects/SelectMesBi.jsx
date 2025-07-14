import React from 'react'
import Select, { components } from 'react-select'
import { customSelectBiStyles } from './customSelectBiStyles'
import { PiCalendarDots } from 'react-icons/pi'

const SingleValueWithIcon = (props) => (
    <components.SingleValue {...props}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PiCalendarDots size={16} />
            {props.data.label}
        </div>
    </components.SingleValue>
)

export const SelectMesBi = ({ mesSelecionado, setMesSelecionado, mesesDisponiveis }) => {

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
            styles={customSelectBiStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
            components={{ SingleValue: SingleValueWithIcon }}
        />
    )
}
