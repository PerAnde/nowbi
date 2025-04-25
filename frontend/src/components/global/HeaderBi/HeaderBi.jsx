import React from 'react'
import { api } from '../../../api/api';
import styles from './HeaderBi.module.scss'
import { capitalizeFirstLetter } from '../../../utils/formatUtils'

export const HeaderBi = ({ empresa }) => {

    return (
        <div className={styles.box_header_bi}>

            <div className={styles.box_infos_empresa}>

                <div className={styles.box_logo_empresa}>
                    <img
                        src={empresa.logo_empresa ? `${api.defaults.baseURL}/files/${empresa.logo_empresa}` : 'Sem foto'}
                        alt="Logo Empresa"
                    />
                </div>

                <div className={styles.box_infos}>
                    <p>{capitalizeFirstLetter(empresa.name)}</p>
                    <p className={styles.cnpj_empresa}>{empresa.cnpj_empresa}</p>
                </div>
            </div>

        </div>
    )
}
