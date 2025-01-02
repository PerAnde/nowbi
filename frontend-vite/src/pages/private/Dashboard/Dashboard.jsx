import { useEffect, useState } from 'react';
import { api } from '../../../services/api';

import { Layout } from '../../../layout/layout';

export const Dashboard = () => {


    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

    // Função para buscar os dados do usuário
    const fetchUsuarioData = async () => {
        try {
            const response = await api.get('/user');  // Fazendo a requisição GET para /user
            setUsuario(response.data);  // Atualiza o estado com os dados do usuário
            setLoading(false);  // Define o carregamento como falso quando os dados são recebidos
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            setLoading(false);  // Define o carregamento como falso em caso de erro
        }

    };

    useEffect(() => {
        fetchUsuarioData();
    }, []);

    if (loading) {
        return (
            <div>
                <p>Carregando...</p>  {/* Exibe uma mensagem de carregamento */}
            </div>
        );
    }


    return (
        <Layout>
            <div>
                <h1>Olá, {usuario.name} 👋</h1>
            </div>
        </Layout>
    );
};
