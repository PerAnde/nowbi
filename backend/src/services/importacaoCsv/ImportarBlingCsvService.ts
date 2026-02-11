import fs from 'fs'
import { parse } from 'csv-parse'

interface LancamentoImportado {
  data: string
  valor: number
  tipo: 'RECEITA' | 'DESPESA'
  subcategoriaNome: string
  descricao: string
  external_id: string
}

export class ImportarBlingCsvService {

  async execute(caminhoArquivo: string): Promise<LancamentoImportado[]> {

    const resultados: LancamentoImportado[] = []

    const parser = fs
      .createReadStream(caminhoArquivo)
      .pipe(parse({
        delimiter: ';',
        columns: true,
        trim: true
      }))

    for await (const linha of parser) {

      if (!linha.Id) continue

      const dataConvertida = this.converterData(linha.Data)
      const valorConvertido = this.converterValor(linha.Valor)
      const tipoConvertido = linha.Tipo === 'C' ? 'RECEITA' : 'DESPESA'

      resultados.push({
        data: dataConvertida,
        valor: valorConvertido,
        tipo: tipoConvertido,
        subcategoriaNome: this.normalizarTexto(linha.Categoria || ''),
        descricao: linha.Histórico || '',
        external_id: linha.Id
      })
    }

    return resultados
  }

  private converterData(data: string): string {
    const [dia, mes, ano] = data.split('/')
    return `${ano}-${mes}-${dia}`
  }

  private converterValor(valor: string): number {
    return Number(
      valor.replace(/\./g, '').replace(',', '.')
    )
  }

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toUpperCase()
  }
}
