import React from 'react';
import Select from 'react-select';
import { customSelectStyles } from './customSelectPeriodoDfc'

const options = [
    { value: 'atual', label: 'Mês Atual' },
    { value: '3', label: 'Últimos 3 meses' },
    { value: '6', label: 'Últimos 6 meses' },
    { value: '12', label: 'Últimos 12 meses' },
];

export const SelectPeriodoDfc = ({ value, onChange }) => {
    const defaultValue = options.find(option => option.value === value);

    return (
        <Select
            options={options}
            value={defaultValue}
            onChange={(selected) => onChange(selected.value)}
            styles={customSelectStyles}
            placeholder="Selecione o período"
            isSearchable={false}
            components={{
                IndicatorSeparator: () => null 
            }}
        />
    );
};