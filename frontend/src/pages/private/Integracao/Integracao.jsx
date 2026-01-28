import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as PiIcons from 'react-icons/pi';
import styles from './Integracao.module.scss';

export const Integracao = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Pegamos os dados da URL para personalizar a mensagem
    const provider = searchParams.get('provider') || 'Plataforma';
    const isError = searchParams.get('error') === 'true';

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {isError ? (
                    <>
                        <PiIcons.PiXCircleFill className={styles.iconError} />
                        <h1>Ops! Algo deu errado</h1>
                        <p>Não conseguimos concluir a integração com o {provider}.</p>
                    </>
                ) : (
                    <>
                        <PiIcons.PiCheckCircleFill className={styles.iconSuccess} />
                        <h1>Integração Concluída!</h1>
                        <p>Agora você pode importar os dados do {provider} para a empresa <strong>NowBi</strong>.</p>
                    </>
                )}
                
                <button onClick={() => navigate('/empresas')} className={styles.btnPrimary}>
                    Ir para o Painel Principal
                </button>
            </div>
        </div>
    );
};