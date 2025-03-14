import React from 'react'
import { useMeses } from '../../hooks/useMeses';
import Select from 'react-select'

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

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'var(--cor-componente)',
            borderRadius: 'var(--border-radius-button)',
            border: '1px solid var(--border-input)',
            padding: '1.8rem',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'var(--border-input)'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'var(--button-cor-primaria-hover)' : 'var(--cor-componente)',
            color: state.isSelected ? 'var(--branco)' : 'var(--texto-primario)',
            padding: '1rem',
            cursor: 'pointer',
            textAlign: 'center',
            '&:hover': {
                backgroundColor: 'var(--button-cor-primaria)',
                color: 'var(--branco)'
            }
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'var(--cor-componente)',
            borderRadius: 'var(--border-radius-button)',
            boxShadow: 'var(--box-shadow-select)',
            zIndex: 9999,
            position: "absolute"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    };

    return (
        <Select
            options={mesOptions}
            value={selectedOptionMes}
            onChange={handleMes}
            placeholder="Selecione um mês"
            unstyled
            styles={customStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />
    )
}
