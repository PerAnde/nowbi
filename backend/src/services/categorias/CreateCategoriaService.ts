import prismaClient from "../../prisma";
import { GrupoDre } from "@prisma/client";

interface CategoriaRequest {
    name: string;
    tipo: 'RECEITA' | 'DESPESA';
    usuario_id: string;
    grupoDre: GrupoDre;
}

class CreateCategoriaService {

    async execute({ name, tipo, usuario_id, grupoDre }: CategoriaRequest) {
        if (!name || !usuario_id) {
            throw new Error("Nome inválido!")
        }
        if (!['RECEITA', 'DESPESA'].includes(tipo)) {
            throw new Error("Tipo inválido!")
        }

        const nomeFormatado = name.trim().toLowerCase();

        const categoriaNomeJaExiste = await prismaClient.categoria.findFirst({
            where: {
                name: nomeFormatado,
                tipo,
                usuario_id
            }
        })

        if (categoriaNomeJaExiste) {
            throw new Error(`Já existe uma categoria chamada "${name}".`);
        }

        const categoria = await prismaClient.categoria.create({
            data: {
                name: name,
                tipo: tipo,
                usuario_id: usuario_id,
                grupoDre
            },
            select: {
                id: true,
                name: true,
                tipo: true,
                usuario_id: true,
                grupoDre: true,
            }
        })

        return categoria
    }

}

export { CreateCategoriaService }