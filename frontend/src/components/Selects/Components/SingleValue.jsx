import { components } from 'react-select';

import imgEmpresaSemLogo from '../../../assets/images/imgEmpresaSemLogo.jpg';

export const SingleValue = (props) => {
    const { data } = props;

    return (
        <components.SingleValue {...props}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {data.logo && (
                    <img
                        src={data.logo}
                        alt={data.label}
                        onError={(e) => {
                            e.currentTarget.src = imgEmpresaSemLogo;
                        }}
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            objectFit: 'contain',
                        }}
                    />
                )}
                <span
                    title={data.label}
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px'
                    }}
                >
                    {data.label}
                </span>
            </div>
        </components.SingleValue>
    );
};
