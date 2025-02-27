import axios from 'axios';
import { toast } from 'sonner';

export const buscarCep = async (cep, setEndereco, setBairro, setCidade, setIbge, setEstado, setCepErro) => {
    if (cep.length !== 8) return;

    try {
        const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        if (res.data.erro) {
            setCepErro(true);
        } else {
            setEndereco(res.data.logradouro || '');
            setBairro(res.data.bairro || '');
            setCidade(res.data.localidade || '');
            setIbge(res.data.ibge || '');
            setEstado(res.data.uf || '');
            setCepErro(false);
        }
    } catch (error) {
        setCepErro(true);
    }
};
