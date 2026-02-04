import { components } from 'react-select';

import imgEmpresaSemLogo from '../../../assets/images/imgEmpresaSemLogo.jpg';

export const Option = (props) => {
    const { data } = props;

    return (
        <components.Option {...props}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {data.logo && (
                    <img
                        src={data.logo}
                        alt={data.label}
                        onError={(e) => {
                            e.currentTarget.src = imgEmpresaSemLogo;
                        }}
                        style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            objectFit: 'contain'
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
        </components.Option>
    );
};
