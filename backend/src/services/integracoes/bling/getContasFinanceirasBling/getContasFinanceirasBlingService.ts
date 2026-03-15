import axios from "axios";
import { BlingTokenProvider } from "../../../../integrations/bling/BlingTokenProvider";

class GetContasFinanceirasBlingService {
    async execute(empresa_id: string) {
        const tokenProvider = new BlingTokenProvider();
        const accessToken = await tokenProvider.getValidToken(empresa_id);

        try {
            const response = await axios.get("https://www.bling.com.br/Api/v3/contas-contabeis", {
                params: {
                    pagina: 1,
                    limite: 100,
                    situacoes: 1 // 1 = Ativo
                },
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            // O Bling retorna os dados em response.data.data
            return response.data.data || [];
        } catch (error) {
            console.error("Erro ao buscar contas contábeis do Bling:", error.message);
            throw new Error("Não foi possível carregar as contas do Bling.");
        }
    }
}

export { GetContasFinanceirasBlingService };