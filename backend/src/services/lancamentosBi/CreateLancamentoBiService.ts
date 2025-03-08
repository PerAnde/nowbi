import prismaClient from "../../prisma";

interface LancamentoRequest {
    valor: number;
    tipo: 'RECEITA' | 'DESPESA';
    categoria: string;
    subcategoria?: string | null;
    id: string;
}

class CreateLancamentoBiService {

    async execute({ valor, tipo, categoria, subcategoria, id }: LancamentoRequest) {

        if (!valor) {
            throw new Error("Valor inválido!")
        }
        if (!['RECEITA', 'DESPESA'].includes(tipo)) {
            throw new Error("Tipo inválido!")
        }
        if (!categoria) {
            throw new Error("Categoria inválida!")
        }
        if (!id) {
            throw new Error("BI inválido!")
        }

        const data: any = {
            valor: valor,
            tipo: tipo,
            categoria_id: categoria,
            businessIntelligence_id: id,
        };

        if (subcategoria) {
            data.subcategoria_id = subcategoria;
        }

        const lancamento = await prismaClient.lancamentoBi.create({
            data,
            select: {
                id: true,
                valor: true,
                tipo: true,
                categoria_id: true,
                subcategoria_id: true,
                businessIntelligence_id: true,
            }
        })

        return lancamento

    }

}

export { CreateLancamentoBiService }