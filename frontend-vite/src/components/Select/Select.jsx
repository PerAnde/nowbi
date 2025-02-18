import React from 'react';
import styles from './Select.module.scss';

export const Select = ({ options, value, onChange, placeholder, ...rest }) => {
    return (
        <select className={styles.select} value={value} onChange={onChange} {...rest}>
            <option value="">{placeholder}</option>
            {options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    );
};
