import { Request, Response } from 'express'
import { ImportarCsvService, LancamentoImportado } from '../../services/importacaoArquivo/ImportarCsvService'
import { ImportarLancamentosService } from '../../services/importacaoArquivo/ImportarLancamentosService'
import { ImportarExcelService } from '../../services/importacaoArquivo/ImportarExcelService'
import fs from 'fs'
import path from 'path'

class ImportacaoArquivoController {

    async handle(req: Request, res: Response) {

        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo não enviado' })
        }

        const { businessIntelligenceId } = req.body
        const usuario_id = req.usuario_id;
        if (!businessIntelligenceId) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
            return res.status(400).json({ error: 'BI não informado' })
        }

        const importarLancamentosService = new ImportarLancamentosService()

        const extensao = path.extname(req.file.originalname).toLocaleLowerCase();

        try {
            let lancamentos: LancamentoImportado[];

            if (extensao === '.csv') {
                const importarCsvService = new ImportarCsvService();
                lancamentos = await importarCsvService.execute(req.file.path)
            }
            else if (extensao === '.xlsx' || extensao === '.xls') {
                const importarExcelService = new ImportarExcelService();
                lancamentos = await importarExcelService.execute(req.file.path)
            }
            else {
                return res.status(400).json({ error: 'Formato de arquivo inválido. Use CSV ou Excel.' })
            }

            const resultado = await importarLancamentosService.execute(
                lancamentos,
                businessIntelligenceId,
                usuario_id,
                'IMPORTACAO_ARQUIVO'
            )

            return res.json(resultado)

        } catch (error: any) {
            return res.status(500).json({
                error: error.message || 'Erro ao processar o arquivo'
            })
        } finally {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path)
            }
        }
    }
}

export { ImportacaoArquivoController }