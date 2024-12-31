import React from 'react'

export const Button = ({ loading, children, ...rest }) => {
    return (
        <button disabled={loading} {...rest}>

            {loading ? (
                <span>Aguarde...</span>
            ) : (
                <span>{children}</span>
            )}

        </button>
    )
}
