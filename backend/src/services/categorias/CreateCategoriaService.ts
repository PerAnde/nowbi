import prismaClient from "../../prisma";
import { GrupoDre } from "@prisma/client";

interface CategoriaRequest {
    name: string;
    tipo: 'RECEITA' | 'DESPESA';
    usuario_id: string;
    grupoDre: GrupoDre;
    empresa_id: string;
}

class CreateCategoriaService {

    async execute({ name, tipo, usuario_id, grupoDre, empresa_id }: CategoriaRequest) {
        if (!name) {
            throw new Error("Nome inválido!")
        }
        if (!empresa_id) {
            throw new Error("O ID da empresa é obrigatório para criar uma categoria!");
        }
        if (!['RECEITA', 'DESPESA'].includes(tipo)) {
            throw new Error("Tipo inválido!")
        }

        const nomeFormatado = name.trim().toLowerCase();

        const categoriaNomeJaExiste = await prismaClient.categoria.findFirst({
            where: {
                name: nomeFormatado,
                tipo,
                empresaId: empresa_id
            }
        })

        if (categoriaNomeJaExiste) {
            throw new Error(`Já existe uma categoria chamada "${name}".`);
        }

        const categoria = await prismaClient.categoria.create({
            data: {
                name: nomeFormatado,
                tipo: tipo,
                usuario_id: usuario_id,
                grupoDre,
                empresaId: empresa_id
            },
            select: {
                id: true,
                name: true,
                tipo: true,
                usuario_id: true,
                grupoDre: true,
                empresaId: true,
            }
        })

        return categoria
    }

}

export { CreateCategoriaService }