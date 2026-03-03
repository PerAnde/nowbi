import { Request, Response } from "express";
import { ImportLancamentosBlingService } from "../../../../services/integracoes/bling/importLancamentosBling/ImportLancamentosBlingService";

class ImportLancamentosBlingController {
    async handle(req: Request, res: Response) {
        try {
            const { empresa_id, bi_id } = req.params;
            const { dataInicial, dataFinal } = req.query;
            const usuario_id = req.usuario_id;

            const importarService = new ImportLancamentosBlingService();

            const resultado = await importarService.execute({
                empresa_id,
                bi_id,
                usuario_id,
                dataInicial: dataInicial as string,
                dataFinal: dataFinal as string
            });

            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { ImportLancamentosBlingController };