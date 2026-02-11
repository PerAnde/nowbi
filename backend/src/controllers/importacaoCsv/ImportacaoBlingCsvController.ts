import { Request, Response } from 'express'
import { ImportarBlingCsvService } from '../../services/importacaoCsv/ImportarBlingCsvService'
import fs from 'fs'

class ImportacaoBlingCsvController {

    async handle(req: Request, res: Response) {

        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo não enviado' })
        }

        const service = new ImportarBlingCsvService()

        try {
            const dados = await service.execute(req.file.path)

            return res.json({
                total: dados.length,
                dados
            })

        } catch (error: any) {

            return res.status(500).json({
                error: error.message || 'Erro ao processar CSV'
            })

        } finally {
            // Remove o arquivo mesmo se der erro
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path)
            }
        }
    }
}

export { ImportacaoBlingCsvController }
