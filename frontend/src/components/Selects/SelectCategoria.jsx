import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'
import { buscarCategorias } from '../../services/categorias'
import { capitalizeFirstLetter } from '../../utils/formatUtils'

export const SelectCategoria = ({ tipo, categoriaSelecionada, setCategoriaSelecionada }) => {

    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        buscarCategorias(setCategorias, setLoading);
    }, []);

    const categoriasFiltradosPorTipo = categorias.filter(categoria => categoria.tipo === tipo);

    const categoriaOptions = categoriasFiltradosPorTipo.map((categoria) => ({
        value: categoria.id,
        label: capitalizeFirstLetter(categoria.name)
    }))

    const selectedOpctionCategoria = categoriaOptions.find(e => e.value === categoriaSelecionada) || null;

    const handleCategoriaUpdate = (event) => {
        setCategoriaSelecionada(event.value);
    }

    return (
        <Select
            placeholder="Selecione uma categoria"
            options={categoriaOptions}
            value={selectedOpctionCategoria}
            onChange={handleCategoriaUpdate}
            isLoading={loading}
            unstyled
            styles={customSelectStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />
    )
}
