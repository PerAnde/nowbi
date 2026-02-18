import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/Button/Button';
import * as PiIcons from 'react-icons/pi';
import styles from './Integracao.module.scss';

export const Integracao = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Pegamos os dados da URL para personalizar a mensagem
    const provider = searchParams.get('provider') || 'Plataforma';
    const isError = searchParams.get('error') === 'true';

    return (
        <div className={styles.containerSucesso}>
            <div className={styles.card}>
                {isError ? (
                    <>
                        <PiIcons.PiXCircle className={styles.iconError} />
                        <h3>Ops! Algo deu errado!</h3>
                        <p>Não conseguimos concluir a integração.</p>
                    </>
                ) : (
                    <>
                        <PiIcons.PiCheckCircle className={styles.iconSuccess} />
                        <h3>Integração concluída com sucesso!</h3>
                    </>
                )}
                
                <Button onClick={() => navigate('/empresas')}>
                    Ir para o Painel Principal
                </Button>
            </div>
        </div>
    );
};