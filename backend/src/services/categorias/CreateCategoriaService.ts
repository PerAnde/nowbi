import prismaClient from "../../prisma";

interface CategoriaRequest {
    name: string;
    tipo: 'RECEITA' | 'DESPESA';
}

class CreateCategoriaService {

    async execute({ name, tipo }: CategoriaRequest) {
        if (name === '') {
            throw new Error("Nome inválido!")
        }
        if (!['RECEITA', 'DESPESA'].includes(tipo)) {
            throw new Error("Tipo inválido!")
        }

        const categoria = await prismaClient.categoria.create({
            data: {
                name: name,
                tipo: tipo,
            },
            select: {
                id: true,
                name: true,
                tipo: true,
            }
        })

        return categoria
    }

}

export { CreateCategoriaService }