export const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        width: '100%',
        backgroundColor: state.isDisabled ? 'var(--cor-componente)' : 'var(--cor-componente)',
        color: state.isDisabled ? 'var(--texto-secundario)' : 'var(--texto-primario)',
        borderRadius: 'var(--border-radius-button)',
        border: '1px solid var(--border-input)',
        padding: '1.5rem',
        boxShadow: 'none',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        '&:hover': {
            borderColor: state.isDisabled ? 'var(--border-disabled)' : 'var(--cor-primaria)',
        }
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'var(--cor-primaria-15)' : 'var(--cor-componente)',
        color: state.isSelected ? 'var(--cor-primaria)' : 'var(--texto-secundario)',
        padding: '1rem',
        cursor: 'pointer',
        textAlign: 'center',
        '&:hover': {
            backgroundColor: 'var(--cor-primaria-15)',
            color: 'var(--cor-primaria)',
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'var(--cor-componente)',
        borderRadius: 'var(--border-radius-button)',
        boxShadow: 'var(--box-shadow-select)',
        zIndex: 9999,
        marginTop: '.5rem',
        position: "absolute",
        padding: '.5rem 0',
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 })
};