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

        const lancamentoExiste = await prismaClient.lancamentoBi.findUnique({
            where: { id },
        });

        if (!lancamentoExiste) {
            throw new Error("Lançamento não encontrado!");
        }

        const updateCategoria = await prismaClient.lancamentoBi.update({
            where: { id },
            data: {
                valor,
                tipo,
                categoria: { connect: { id: categoria } },
                subcategoria: subcategoria ? { connect: { id: subcategoria } } : undefined
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