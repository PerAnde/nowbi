import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { customSelectStyles } from './customSelectStyles'
import { buscarSubcategorias } from '../../services/subcategorias'
import { capitalizeFirstLetter } from '../../utils/formatUtils'

export const SelectSubcategoria = ({ categoriaSelecionada, subcategoriaSelecionada, setSubcategoriaSelecionada }) => {

    const [subcategorias, setSubcategorias] = useState([]);
    const [loadingSubcategorias, setLoadingSubcategorias] = useState(false);
    
    // Buscando todas as categorias
    useEffect(() => {
        if (categoriaSelecionada) {
            setLoadingSubcategorias(true);
            setSubcategoriaSelecionada('');
            buscarSubcategorias(categoriaSelecionada, setSubcategorias, setLoadingSubcategorias);
        } else {
            setSubcategorias([]);
            setSubcategoriaSelecionada('');
        }
    }, [categoriaSelecionada, setSubcategoriaSelecionada]);

    useEffect(() => {
        if (!loadingSubcategorias && subcategoriaSelecionada && subcategorias.length > 0) {
            const existe = subcategorias.find(sc => sc.id === subcategoriaSelecionada);
            if (!existe) {
                setSubcategoriaSelecionada('');
            }
        }
    }, [subcategorias, loadingSubcategorias]);

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
            isLoading={loadingSubcategorias}
            onChange={handleSubcategoriaUpdate}
            unstyled
            styles={customSelectStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuPlacement="auto"
        />

    )
}
