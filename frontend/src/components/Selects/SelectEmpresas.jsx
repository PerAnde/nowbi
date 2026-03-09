import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select'
import { useAuth } from '../../contexts/useAuth'
import { customSelectStyles } from './customSelectEmpresasStyles'

import { api } from '../../api/api';
import { buscarEmpresas } from '../../services/empresas';

import { Option } from './Components/Option';
import { SingleValue } from './Components/SingleValue';

import imgEmpresaSemLogo from '../../assets/images/imgEmpresaSemLogo.jpg'

export const SelectEmpresas = () => {

    const { isPeriodoTesteAtivo, isPlanoAtivo } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);

    const planoExpirado = !isPeriodoTesteAtivo && !isPlanoAtivo;

    useEffect(() => {
        buscarEmpresas(setEmpresas, setLoading, planoExpirado)
    }, [planoExpirado])

    const opcoesEmpresas = empresas.map(empresa => ({
        value: empresa.id,
        label: empresa.name,
        logo: empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : null
    }));

    const empresaSelecionada = opcoesEmpresas.find(
        emp => emp.value === id
    ) || null;

    const handleChangeEmpresa = (option) => {
        if (option?.value && option.value !== id) {
            navigate(`/empresas/${option.value}`);
        }
    };

    return (
        <Select
            options={opcoesEmpresas}
            value={empresaSelecionada}
            onChange={handleChangeEmpresa}
            placeholder={loading ? 'Carregando empresas...' : 'Selecione uma empresa'}
            isDisabled={loading || planoExpirado}
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
