import { TipoCategoria } from "@prisma/client";
import prismaClient from "../../prisma";

interface UpdateLancamentoRequest {
    id: string;
    valor: number;
    tipo: 'RECEITA' | 'DESPESA';
    categoria: string;
    subcategoria?: string | null;
}

class UpdateLancamentoBiService {
    async execute({ id, valor, tipo, categoria, subcategoria }: UpdateLancamentoRequest) {
        if (!id) {
            throw new Error("ID inválido!")
        }
        if (!valor) {
            throw new Error("Valor inválido!")
        }
        if (!['RECEITA', 'DESPESA'].includes(tipo)) {
            throw new Error("Tipo inválido!")
        }
        if (!categoria) {
            throw new Error("Categoria inválida!")
        }

        // Valida se o lancamento existe
        const lancamentoExiste = await prismaClient.lancamentoBi.findUnique({
            where: { id },
        });

        if (!lancamentoExiste) {
            throw new Error("Lançamento não encontrado!");
        }

        // Busca a categoria no banco de dados
        const categoriaExiste = await prismaClient.categoria.findUnique({
            where: { id: categoria },
            select: { tipo: true }
        });

        if (!categoriaExiste) {
            throw new Error("Categoria não encontrada!");
        }

        // Valida se o tipo da categoria corresponde ao tipo do lançamento
        if (categoriaExiste.tipo !== tipo) {
            throw new Error(`A categoria informada pertence ao tipo ${categoriaExiste.tipo}, mas o lançamento é do tipo ${tipo}.`);
        }

        if (subcategoria) {
            const subcategoriaExiste = await prismaClient.subCategoria.findUnique({
                where: { id: subcategoria },
                select: { categoria_id: true }
            });

            if (!subcategoriaExiste) {
                throw new Error("Subcategoria não encontrada!");
            }

            if (subcategoriaExiste.categoria_id !== categoria) {
                throw new Error("A subcategoria informada não pertence à categoria selecionada!");
            }
        }

        const updateCategoria = await prismaClient.lancamentoBi.update({
            where: { id },
            data: {
                valor,
                tipo,
                categoria: { connect: { id: categoria } },
                subcategoria: subcategoria ? { connect: { id: subcategoria } } : { disconnect: true }
            },
            select: {
                id: true,
                valor: true,
                tipo: true,
                categoria: true,
                subcategoria: true
            }
        })

        return updateCategoria;
    }
}

export { UpdateLancamentoBiService }