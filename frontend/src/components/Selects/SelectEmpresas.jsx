import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import { customSelectStyles } from './customSelectEmpresasStyles'

import { api } from '../../api/api';
import { buscarEmpresas } from '../../services/empresas';

import { Option } from './Components/Option';
import { SingleValue } from './Components/SingleValue';

import imgEmpresaSemLogo from '../../assets/images/imgEmpresaSemLogo.jpg'

export const SelectEmpresas = () => {

    const navigate = useNavigate();

    const [empresas, setEmpresas] = useState([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        buscarEmpresas(setEmpresas, setLoading)
    }, [])

    const opcoesEmpresas = empresas.map(empresa => ({
        value: empresa.id,
        label: empresa.name,
        logo: empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : null
    }));

    const handleChangeEmpresa = (option) => {
        setEmpresaSelecionada(option);

        if (option?.value) {
            navigate(`/empresas/${option.value}`);
        }
    };
    return (
        <Select
            options={opcoesEmpresas}
            value={empresaSelecionada}
            onChange={handleChangeEmpresa}
            placeholder={loading ? 'Carregando empresas...' : 'Selecione uma empresa'}
            isDisabled={loading}
            isSearchable={false}
            unstyled
            styles={customSelectStyles}
            components={{
                Option,
                SingleValue
            }}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />

    )
}
