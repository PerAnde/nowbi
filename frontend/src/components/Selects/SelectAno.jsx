import React from 'react'
import { useAnos } from '../../hooks/useAnos';
import Select from 'react-select'

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
            options={anoOptions}
            value={selectedOptionAno}
            onChange={handleAno}
            placeholder="Selecione um ano"
            unstyled
            styles={customStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />
    )
}
