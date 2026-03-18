import XLSX from 'xlsx';
import { LancamentoImportado } from './ImportarCsvService';

export class ImportarExcelService {
    async execute(caminhoArquivo: string): Promise<LancamentoImportado[]> {

        const workbook = XLSX.readFile(caminhoArquivo, { cellDates: true });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const dados: any[] = XLSX.utils.sheet_to_json(worksheet);

        return dados.map((linha, index) => {
            const dataRaw = linha['Data movimento'] || linha['Data'] || linha['Data Movimento'];
            const valorRaw = linha['Valor (R$)'] || linha['Valor Total'] || linha['Valor'];
            const categoriaRaw = linha['Categoria 1'] || linha['Categoria'] || linha['Plano de Contas'];
            const tipoRaw = linha['Tipo'] || linha['D/C'];

            const externalIdRaw = linha['ID'] || linha['Cod.'] || `gen-xls-${index}-${Date.now()}`;

            const valorNumerico = this.limparValor(valorRaw);

            return {
                valor: this.limparValor(valorRaw),
                tipo: this.identificarTipo(tipoRaw),
                subcategoriaNome: String(categoriaRaw || 'SEM CATEGORIA').toUpperCase(),
                external_id: String(externalIdRaw),
                data: this.tratarData(dataRaw)
            };
        });
    }

    private tratarData(valor: any): Date {
        if (valor instanceof Date) {
            return isNaN(valor.getTime()) ? new Date() : valor;
        }

        if (typeof valor === 'string') {
            const dataLimpa = valor.replace(/"/g, '').trim();
            const partes = dataLimpa.split('/');

            if (partes.length === 3) {
                const dia = parseInt(partes[0], 10);
                const mes = parseInt(partes[1], 10) - 1;
                const ano = parseInt(partes[2], 10);
                const data = new Date(ano, mes, dia);
                return isNaN(data.getTime()) ? new Date() : data;
            }
            const d = new Date(dataLimpa);
            return isNaN(d.getTime()) ? new Date() : d;
        }

        if (typeof valor === 'number' && valor > 30000) {
            return new Date((valor - 25569) * 86400 * 1000);
        }

        return new Date();
    }

    private identificarTipo(tipo: any): 'RECEITA' | 'DESPESA' {
        const t = String(tipo || '').toUpperCase();
        if (t.includes('RECEITA') || t === 'C' || t === 'ENTRADA') return 'RECEITA';
        return 'DESPESA';
    }

    private limparValor(valor: any): number {
        if (typeof valor === 'number') {
            return Math.abs(valor);
        }

        if (!valor) return 0;

        const stringValor = String(valor)
            .replace('R$', '')
            .replace(/[^\d,-]/g, '')
            .replace(',', '.');

        const numero = Number(stringValor);

        return isNaN(numero) ? 0 : Math.abs(numero);
    }
}