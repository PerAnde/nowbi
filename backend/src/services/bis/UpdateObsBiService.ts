import prismaClient from "../../prisma";

interface UpdateObsBiRequest {
    bi_id: string;
    usuario_id: string;
    periodo_mes?: string;
    resumo_geral?: string;
    analise_receita?: string;
    analise_despesa?: string;
    pontos_atencao?: string;
    recomendacoes?: string;
    conclusao?: string;
}

class UpdateObsBiService {
    async execute({ bi_id, usuario_id, ...dados }: UpdateObsBiRequest) {
        if (!bi_id) throw new Error("ID inválido!");

        const bi = await prismaClient.businessIntelligence.findUnique({
            where: { id: bi_id },
            include: { empresa: true }
        });

        if (!bi) throw new Error("BI não encontrado!");
        if (bi.empresa.usuario_id !== usuario_id)
            throw new Error("Sem permissão!");

        return await prismaClient.observacoesBi.upsert({
            where: { businessIntelligence_id: bi_id },
            update: {
                periodo_mes: dados.periodo_mes,
                resumo_geral: dados.resumo_geral,
                analise_receita: dados.analise_receita,
                analise_despesa: dados.analise_despesa,
                pontos_atencao: dados.pontos_atencao,
                recomendacoes: dados.recomendacoes,
                conclusao: dados.conclusao,
                conteudo: "",
            },
            create: {
                businessIntelligence: {
                    connect: { id: bi_id }
                },
                periodo_mes: dados.periodo_mes || '',
                resumo_geral: dados.resumo_geral || '',
                analise_receita: dados.analise_receita || '',
                analise_despesa: dados.analise_despesa || '',
                pontos_atencao: dados.pontos_atencao || '',
                recomendacoes: dados.recomendacoes || '',
                conclusao: dados.conclusao || '',
                conteudo: "",
            }
        });
    }
}

export { UpdateObsBiService };
