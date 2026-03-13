import { OrigemLancamento, PrismaClient } from '@prisma/client'
import { LancamentoImportado } from './ImportarBlingCsvService'

const prisma = new PrismaClient()

interface ResultadoImportacao {
    importados: number
    naoImportados: LancamentoImportado[]
    duplicados: number
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

        const idsExternosNoArquivo = lancamentos.map(l => l.external_id.trim());

        const lancamentosJaExistentes = await prisma.lancamentoBi.findMany({
            where: {
                id_externo_lancamento: { in: idsExternosNoArquivo }
            },
            select: { id_externo_lancamento: true }
        });

        const setIdsNoBanco = new Set(lancamentosJaExistentes.map(l => l.id_externo_lancamento));

        const naoImportados: LancamentoImportado[] = [];
        const dadosParaInserir: any[] = [];
        let duplicados = 0;

        for (const lanc of lancamentos) {
            const idLimpo = lanc.external_id.trim();

            if (setIdsNoBanco.has(idLimpo)) {
                duplicados++;
                continue;
            }

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
                id_externo_lancamento: idLimpo,
                origem_lancamento: 'IMPORTACAO_ARQUIVO'
            });
            setIdsNoBanco.add(idLimpo);
        }

        let importados = 0;

        if (dadosParaInserir.length > 0) {
            const resultado = await prisma.lancamentoBi.createMany({
                data: dadosParaInserir,
                skipDuplicates: true
            });
            importados = resultado.count;
        }

        return { importados, naoImportados, duplicados };
    }
}
