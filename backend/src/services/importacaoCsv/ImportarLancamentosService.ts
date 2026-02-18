import { PrismaClient } from '@prisma/client'
import { LancamentoImportado } from './ImportarBlingCsvService'

const prisma = new PrismaClient()

interface ResultadoImportacao {
    importados: number
    naoImportados: LancamentoImportado[]
}

export class ImportarLancamentosService {

    private normalizarParaComparacao(texto: string): string {
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toUpperCase()
    }

    async execute(lancamentos: LancamentoImportado[], businessIntelligenceId: string, usuario_id: string): Promise<ResultadoImportacao> {

        const bi = await prisma.businessIntelligence.findFirst({
            where: {
                id: businessIntelligenceId,
                empresa: { usuario_id: usuario_id }
            },
            select: { id: true, empresa_id: true }
        });

        if (!bi) throw new Error('BI não encontrado ou inválido.');

        const subcategorias = await prisma.subCategoria.findMany({
            where: { empresaId: bi.empresa_id },
            include: { categoria: true }
        });

        const subcategoriaMap = new Map(subcategorias.map(s => [this.normalizarParaComparacao(s.name), s]));

        const naoImportados: LancamentoImportado[] = [];
        const dadosParaInserir: any[] = [];

        // 1. PRIMEIRO: Percorre todos os itens e separa o que pode ser inserido
        for (const lanc of lancamentos) {
            const subcategoria = subcategoriaMap.get(this.normalizarParaComparacao(lanc.subcategoriaNome));

            if (!subcategoria) {
                naoImportados.push(lanc);
                continue;
            }

            dadosParaInserir.push({
                valor: lanc.valor,
                tipo: lanc.tipo,
                categoria_id: subcategoria.categoria_id,
                subcategoria_id: subcategoria.id,
                businessIntelligence_id: businessIntelligenceId,
                id_externo_lancamento: lanc.external_id
            });
        } // <--- O loop termina aqui!

        // 2. DEPOIS: Faz a inserção em lote de uma vez só
        let importados = 0;

        if (dadosParaInserir.length > 0) {
            const resultado = await prisma.lancamentoBi.createMany({
                data: dadosParaInserir,
                skipDuplicates: true
            });
            importados = resultado.count;
        }

        // 3. POR FIM: Retorna o resultado final
        return { importados, naoImportados };
    }
}
