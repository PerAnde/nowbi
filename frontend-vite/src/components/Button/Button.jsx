import React from 'react'

export const Button = ({ loading, children, ...rest }) => {
    return (
        <button className={`button ${loading ? 'btn_loading' : ''}`} disabled={loading} {...rest}>

            {loading ? (
                <span>Carregando...</span>
            ) : (
                <span>{children}</span>
            )}

        </button>
    )
}
