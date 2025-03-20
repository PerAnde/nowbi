import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'
import { buscarSubcategorias } from '../../services/subcategorias'

export const SelectSubcategoria = ({ categoriaSelecionada, subcategoriaSelecionada, setSubcategoriaSelecionada }) => {

    const [subcategorias, setSubcategorias] = useState([]);
    const [loadingSubcategorias, setLoadingSubcategorias] = useState("");

    // Buscando todas as categorias
    useEffect(() => {
        if (categoriaSelecionada) {
            setLoadingSubcategorias(true);
            buscarSubcategorias(categoriaSelecionada, setSubcategorias, setLoadingSubcategorias);
        } else {
            setSubcategorias([]);
        }
    }, [categoriaSelecionada]);


    const subcategoriaOptions = subcategorias.map((subcategoria) => ({
        value: subcategoria.id,
        label: subcategoria.name
    }))

    const selectedOpctionSubcategoria = subcategoriaOptions.find(e => e.value === subcategoriaSelecionada)

    const handleSubcategoriaUpdate = (event) => {
        setSubcategoriaSelecionada(event.value);
    }


    return (
        <Select
            key={categoriaSelecionada}
            loading={loadingSubcategorias}
            isDisabled={loadingSubcategorias || subcategoriaOptions.length === 0}
            placeholder="Selecione uma subcategoria"
            value={selectedOpctionSubcategoria || null}
            options={subcategoriaOptions}
            onChange={handleSubcategoriaUpdate}
            unstyled
            styles={customSelectStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />

    )
}
