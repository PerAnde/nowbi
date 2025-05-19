import React from 'react'
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'

const gruposReceita = [
    { label: 'Receita Operacional Bruta', value: 'RECEITA_OPERACIONAL_BRUTA' },
    { label: 'Receita Financeira', value: 'RECEITA_FINANCEIRA' },
    { label: 'Outras Receitas', value: 'OUTRAS_RECEITAS' },
];

const gruposDespesa = [
    { label: 'Deduções da Receita Bruta', value: 'DEDUCOES_DA_RECEITA_BRUTA' },
    { label: 'Custo Variável (CPV ou CMV)', value: 'CUSTO_VARIAVEL' },
    { label: 'Despesas Operacionais', value: 'DESPESAS_OPERACIONAIS' },
    { label: 'Despesas Financeiras', value: 'DESPESAS_FINANCEIRAS' },
    { label: 'Despesas Variáveis', value: 'DESPESAS_VARIAVEIS' },
    { label: 'Outras Despesas', value: 'OUTRAS_DESPESAS' },
    { label: 'IR CSLL', value: 'IR_CSLL' },
];

export const SelectGrupoDre = ({ tipo, grupoDre, setGrupoDre }) => {
    if (!tipo) return null;

    const options = [
        { label: 'Não exibir na DRE', value: 'NAO_EXIBIR_NO_DRE' },
        ...(tipo === 'RECEITA' ? gruposReceita : gruposDespesa)
    ];

    const selectedOption = options.find(opt => opt.value === grupoDre);

    const handleChange = (selected) => {
        setGrupoDre(selected.value);
    };

    return (
        <Select
            placeholder="Selecione o grupo da DRE"
            options={options}
            value={selectedOption}
            onChange={handleChange}
            unstyled
            styles={customSelectStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />
    );
};
