import { Request, Response } from 'express'
import { ImportarBlingCsvService, LancamentoImportado } from '../../services/importacaoCsv/ImportarBlingCsvService'
import { ImportarLancamentosService } from '../../services/importacaoCsv/ImportarLancamentosService'
import fs from 'fs'

class ImportacaoBlingCsvController {

    async handle(req: Request, res: Response) {

        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo não enviado' })
        }

        const { businessIntelligenceId } = req.body
        const usuario_id = req.usuario_id;
        if (!businessIntelligenceId) {
            return res.status(400).json({ error: 'BI não informado' })
        }

        const importarCsvService = new ImportarBlingCsvService()
        const importarLancamentosService = new ImportarLancamentosService()

        try {
            const lancamentos: LancamentoImportado[] = await importarCsvService.execute(req.file.path)

            const resultado = await importarLancamentosService.execute(lancamentos, businessIntelligenceId, usuario_id)

            return res.json(resultado)

        } catch (error: any) {
            return res.status(500).json({
                error: error.message || 'Erro ao processar CSV'
            })
        } finally {
            // Remove o arquivo temporário
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path)
            }
        }
    }
}

export { ImportacaoBlingCsvController }
