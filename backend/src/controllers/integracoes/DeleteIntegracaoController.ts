import { Request, Response } from "express";
import { DeleteIntegracaoService } from "../../services/integracoes/DeleteIntegracoesService";

class DeleteIntegracaoController {
    async handle(req: Request, res: Response) {
        try {
            const { empresa_id } = req.params;
            const usuario_id = req.usuario_id;

            const deleteIntegracaoService = new DeleteIntegracaoService();

            await deleteIntegracaoService.execute({
                empresa_id,
                usuario_id
            });

            return res.status(200).json({ message: "Integração removida com sucesso!" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { DeleteIntegracaoController };