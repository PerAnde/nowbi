import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'
import { buscarCategoriasPorEmpresa } from '../../services/categorias'
import { capitalizeFirstLetter } from '../../utils/formatUtils'

export const SelectCategoria = ({ tipo, empresaId, categoriaSelecionada, setCategoriaSelecionada }) => {

    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (empresaId) {
            buscarCategoriasPorEmpresa(empresaId, setCategorias, setLoading);
        }
    }, [empresaId]);

    const categoriasFiltradas = categorias.filter(c => c.tipo === tipo);

    const categoriaOptions = categoriasFiltradas.map((cat) => ({
        value: cat.id,
        label: capitalizeFirstLetter(cat.name)
    }));

    const selectedOption = categoriaOptions.find(opt => opt.value === categoriaSelecionada) || null;

    const handleCategoriaUpdate = (event) => {
        setCategoriaSelecionada(event.value);
    }

    return (
        <Select
            key={`select-cat-${categorias.length}-${tipo}`}
            placeholder="Selecione uma categoria"
            options={categoriaOptions}
            value={selectedOption}
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
