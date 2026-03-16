import fs from 'fs'
import { parse } from 'csv-parse'

export interface LancamentoImportado {
    valor: number
    tipo: 'RECEITA' | 'DESPESA'
    subcategoriaNome: string
    external_id: string
    data: Date
}

export class ImportarCsvService {

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

            const dataConvertida = this.converterData(linha.Data);

            resultados.push({
                valor: valorConvertido,
                tipo: tipoConvertido,
                subcategoriaNome: subcategoriaNormalizada,
                external_id: linha.Id,
                data: dataConvertida
            })
        }

        return resultados
    }

    private converterValor(valor: string): number {
        if (!valor) return 0;
        const numero = Number(
            valor.replace(/\./g, '').replace(',', '.')
        );
        return Math.abs(numero);
    }

    private normalizarTexto(texto: string): string {
        return texto
            .trim()
            .toUpperCase()
    }

    private converterData(dataString: string): Date {
        if (!dataString) return new Date();
        const partes = dataString.split('/');
        if (partes.length === 3) {
            const [dia, mes, ano] = partes.map(Number);
            return new Date(ano, mes - 1, dia);
        }
        return new Date(dataString);
    }
}
