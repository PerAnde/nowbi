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
                empresa: {
                    usuario_id: usuario_id // O BI não tem usuario_id, mas a Empresa tem!
                }
            },
            select: { id: true }
        });

        if (!bi) {
            throw new Error('Business Intelligence não encontrado ou inválido.');
        }

        //  Pré-carrega todas as subcategorias cadastradas
        const subcategorias = await prisma.subCategoria.findMany({
            where: {
                categoria: {
                    usuario_id: usuario_id
                }
            },
            include: {
                categoria: true // Necessário para pegar o categoria_id depois
            }
        });

        const subcategoriaMap = new Map(subcategorias.map(s => [this.normalizarParaComparacao(s.name), s]))

        const naoImportados: LancamentoImportado[] = []
        let importados = 0

        for (const lanc of lancamentos) {

            // Verifica se a subcategoria existe
            const subcategoria = subcategoriaMap.get(this.normalizarParaComparacao(lanc.subcategoriaNome));
            if (!subcategoria) {
                naoImportados.push(lanc)
                continue
            }

            // Verifica duplicidade pelo external_id
            const existente = await prisma.lancamentoBi.findUnique({
                where: { id_externo_lancamento: lanc.external_id }
            })
            if (existente) continue

            // Cria o lançamento
            await prisma.lancamentoBi.create({
                data: {
                    valor: lanc.valor,
                    tipo: lanc.tipo,
                    categoria_id: subcategoria.categoria_id,
                    subcategoria_id: subcategoria.id,
                    businessIntelligence_id: businessIntelligenceId,
                    id_externo_lancamento: lanc.external_id
                }
            })

            importados++
        }

        return { importados, naoImportados }
    }
}
