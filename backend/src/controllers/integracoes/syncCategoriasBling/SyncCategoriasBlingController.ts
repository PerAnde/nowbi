import { Request, Response } from "express";
import { SyncCategoriasBlingService } from "../../../services/integracoes/syncCategoriasBling/SyncCategoriasBlingService";

class SyncCategoriasController {
    async handle(req: Request, res: Response) {
        try {
            const { empresa_id } = req.params;
            const usuario_id = req.usuario_id; // Vem do seu middleware de autenticação

            if (!empresa_id) {
                return res.status(400).json({ error: "ID da empresa é obrigatório." });
            }

            const syncService = new SyncCategoriasBlingService();

            const resultado = await syncService.execute(empresa_id, usuario_id);

            return res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro na rota de sync:", error.message);
            return res.status(400).json({ error: error.message });
        }
    }
}

export { SyncCategoriasController };