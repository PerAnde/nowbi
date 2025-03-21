import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'
import { buscarGrupos } from '../../services/grupoEmpresas'

export const SelectGrupoEmpresa = ({ grupoSelecionado, setGrupoSelecionado }) => {

    const [grupos, setGrupos] = useState([]);

    useEffect(() => {
        buscarGrupos(setGrupos)
    }, [])

    const grupoOptions = grupos.map((grupo) => ({
        value: grupo.id,
        label: grupo.name
    }))

    const selectedOpctionGrupo = grupoOptions.find(e => e.value === grupoSelecionado) || null;

    const handleCategoriaUpdate = (event) => {
        setGrupoSelecionado(event.value);
    }

    return (
        <Select
            placeholder="Buscar grupo"
            options={[{ value: null, label: "Todas as empresas" }, ...grupoOptions]}
            value={selectedOpctionGrupo}
            onChange={handleCategoriaUpdate}
            isDisabled={grupos.length > 0 ? false : true}
            unstyled
            styles={customSelectStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />
    )
}
