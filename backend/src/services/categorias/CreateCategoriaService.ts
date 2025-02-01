import prismaClient from "../../prisma";

interface CategoriaRequest {
    name: string;
    tipo: 'RECEITA' | 'DESPESA';
    usuario_id: string;
}

class CreateCategoriaService {

    async execute({ name, tipo, usuario_id }: CategoriaRequest) {
        if (!name || !usuario_id) {
            throw new Error("Nome inválido!")
        }
        if (!['RECEITA', 'DESPESA'].includes(tipo)) {
            throw new Error("Tipo inválido!")
        }

        const categoria = await prismaClient.categoria.create({
            data: {
                name: name,
                tipo: tipo,
                usuario_id: usuario_id,
            },
            select: {
                id: true,
                name: true,
                tipo: true,
                usuario_id: true,
            }
        })

        return categoria
    }

}

export { CreateCategoriaService }