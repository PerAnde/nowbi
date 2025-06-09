import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'
import { buscarSubcategorias } from '../../services/subcategorias'
import { capitalizeFirstLetter } from '../../utils/formatUtils'

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

    useEffect(() => {
        if (subcategoriaSelecionada && subcategorias.length > 0) {
            const existe = subcategorias.find(sc => sc.id === subcategoriaSelecionada);
            if (!existe) {
                // resetar se for inválida
                setSubcategoriaSelecionada('');
            }
        }
    }, [subcategorias]);

    const subcategoriaOptions = (subcategorias || []).map((subcategoria) => ({
        value: subcategoria.id,
        label: capitalizeFirstLetter(subcategoria.name)
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
