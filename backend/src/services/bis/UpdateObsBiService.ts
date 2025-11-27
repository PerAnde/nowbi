import prismaClient from "../../prisma";

interface UpdateObsBiRequest {
    bi_id: string;
    conteudo: string;
    usuario_id: string;
}

class UpdateObsBiService {
    async execute({ bi_id, conteudo, usuario_id }: UpdateObsBiRequest) {

        if (!bi_id) throw new Error("ID inválido!");
        if (conteudo === undefined) throw new Error("Conteúdo é obrigatório!");

        // confirmar se o BI existe e pertence ao usuário
        const bi = await prismaClient.businessIntelligence.findUnique({
            where: { id: bi_id },
            include: { empresa: true }
        });

        if (!bi) throw new Error("BI não encontrado!");
        if (bi.empresa.usuario_id !== usuario_id)
            throw new Error("Sem permissão para editar este BI!");

        // verificar se já existe observação
        const existente = await prismaClient.observacoesBi.findUnique({
            where: { businessIntelligence_id: bi_id }
        });

        if (existente) {
            // atualiza
            return await prismaClient.observacoesBi.update({
                where: { businessIntelligence_id: bi_id },
                data: { conteudo },
                select: {
                    id: true,
                    conteudo: true,
                    updated_at: true
                }
            });
        }

        // cria caso não exista
        return await prismaClient.observacoesBi.create({
            data: {
                businessIntelligence_id: bi_id,
                conteudo
            },
            select: {
                id: true,
                conteudo: true,
                created_at: true
            }
        });
    }
}

export { UpdateObsBiService };
