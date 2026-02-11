import fs from 'fs'
import { parse } from 'csv-parse'

export interface LancamentoImportado {
    valor: number
    tipo: 'RECEITA' | 'DESPESA'
    subcategoriaNome: string
    external_id: string
}

export class ImportarBlingCsvService {

    private palavrasIgnoradas = [
        'TRANSFER'
    ]

    private deveIgnorarLancamento(subcategoria: string): boolean {
        const texto = this.normalizarTexto(subcategoria)

        return this.palavrasIgnoradas.some(p =>
            texto.includes(p)
        )
    }

    async execute(caminhoArquivo: string): Promise<LancamentoImportado[]> {

        const resultados: LancamentoImportado[] = []

        const parser = fs
            .createReadStream(caminhoArquivo)
            .pipe(parse({
                delimiter: ';',
                columns: true,
                trim: true,
                bom: true
            }))

        for await (const linha of parser) {

            if (!linha.Id) continue

            const subcategoriaNormalizada = this.normalizarTexto(linha.Categoria || '')

            if (this.deveIgnorarLancamento(subcategoriaNormalizada)) {
                continue
            }

            const valorConvertido = this.converterValor(linha.Valor)
            const tipoConvertido = linha.Tipo === 'C' ? 'RECEITA' : 'DESPESA'

            resultados.push({
                valor: valorConvertido,
                tipo: tipoConvertido,
                subcategoriaNome: subcategoriaNormalizada,
                external_id: linha.Id
            })
        }

        return resultados
    }

    private converterValor(valor: string): number {
        return Number(
            valor.replace(/\./g, '').replace(',', '.')
        )
    }

    private normalizarTexto(texto: string): string {
        return texto
            .trim()
            .toUpperCase()
    }
}
