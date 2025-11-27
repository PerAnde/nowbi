import prismaClient from "../../prisma";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface RequestData {
    bi_id: string;
    usuario_id: string;
}

class GenerateReportBiService {
    async execute({ bi_id, usuario_id }: RequestData) {

        // 1) Buscar BI
        const bi = await prismaClient.businessIntelligence.findUnique({
            where: { id: bi_id },
            select: {
                id: true,
                mes: true,
                ano: true,
                status: true,
                observacoes: { select: { conteudo: true } },
                empresa: { select: { id: true, name: true, usuario_id: true } },
                lancamentoBi: {
                    select: {
                        valor: true,
                        tipo: true,
                        created_at: true,
                        categoria: { select: { name: true } },
                        subcategoria: { select: { name: true } }
                    }
                }
            }
        });

        if (!bi) throw new Error("BI não encontrado");

        if (bi.empresa.usuario_id !== usuario_id)
            throw new Error("Acesso negado");

        // 2) Processar dados
        const receitas = bi.lancamentoBi.filter(l => l.tipo === "RECEITA");
        const despesas = bi.lancamentoBi.filter(l => l.tipo === "DESPESA");

        const dadosParaIA = {
            mes: bi.mes,
            ano: bi.ano,
            empresa: bi.empresa.name,
            totalReceitas: receitas.reduce((acc, r) => acc + Number(r.valor), 0),
            totalDespesas: despesas.reduce((acc, d) => acc + Number(d.valor), 0),
            lancamentos: bi.lancamentoBi.map(l => ({
                valor: Number(l.valor),
                tipo: l.tipo,
                categoria: l.categoria?.name,
                subcategoria: l.subcategoria?.name,
                data: l.created_at.toLocaleDateString("pt-BR")
            }))
        };

        // 3) Prompt
        const prompt = `
Você é um analista financeiro sênior. Gere um relatório profissional e completo baseado exclusivamente nos dados fornecidos a seguir.

O relatório deve ser profundo, como uma consultoria financeira real, mantendo um tom profissional, porém acessível, sem excesso de termos técnicos difíceis, e totalmente realista, sem suavizar problemas e sem ser excessivamente otimista quando a saúde financeira não for boa.

REGRAS DE FORMATAÇÃO

O texto deve ser entregue com formatação HTML, as seguintes classes e propriedades podem ser utilizadas:
Utilize apenas as propriedades e classes abaixo, não é necessário informações sobre o conteúdo ser ou não em HTML, não utilize marcação para indicar que é um arquivo HTML não utiliza

Tags permitidas:

<p> — parágrafos
<br> — quebras de linha
<strong> — negrito
<ul><li></li></ul> — listas pontuadas
<span> — para aplicar cor em trechos específicos

Tamanhos de fonte (aplicados em <p>):

Tamanho normal → <p> sem classe
Fonte grande → <p class="ql-size-large">

Alinhamento (aplicados em <p>):

Esquerda → sem classe
Centro → <p class="ql-align-center">
Direita → <p class="ql-align-right">

Cores (aplicadas somente dentro de <span> dentro de <p>):

Preto padrão → <span> (sem style)
Cinza → <span style="color: rgb(136, 136, 136)">
Vermelho (informações negativas) → <span style="color: rgb(161, 0, 0)">
Laranja (informações moderadas) → <span style="color: rgb(178, 107, 0)">
Verde (informações positivas) → <span style="color: rgb(0, 97, 0)">

Regras gerais de formatação:

Use negrito para:

título
nome da empresa
mês e ano
números relevantes
conclusões
termos como saúde financeira boa/moderada/ruim

Use listas pontuadas quando necessário

Sempre separar títulos, parágrafos e listas com quebras de linha: <br>

ESTRUTURA OBRIGATÓRIA DO RELATÓRIO

Siga rigorosamente esta estrutura:

1) Título do Relatório

Deve ser centralizado, em fonte grande, com negrito, linha única.
Exemplo:
<p class="ql-align-center ql-size-large"><strong>Relatório de Análise Financeira — Janeiro/2025</strong></p>
<br>

2) Visão Geral

Conteúdo esperado:
Resumo claro do mês analisado
Principais destaques financeiros
Indicação da saúde financeira utilizando expressões como:
boa (use verde)
moderada (use laranja)
preocupante (use vermelho)
Não exagere nem positivamente nem negativamente
Evite frases vagas — seja direto

<br>

3) Análise de Receitas

Receitas que mais contribuíram
Ocorrência de crescimento ou queda
Comparações internas entre categorias
Identificação de sazonalidade, dependência de poucas fontes ou inconsistências

<br>

4) Análise de Despesas

Principais categorias de gastos
Quais tiveram aumento significativo
Gastos anormais
Possíveis ineficiências
Diferenciar despesas fixas e variáveis quando os dados permitirem
Impacto das despesas no resultado final

<br>

5) Pontos de Atenção (lista pontuada)

Coloque apenas itens realmente relevantes:
Gastos incomuns
Receitas irregulares
Queda inesperada em algum grupo
Problemas que podem impactar meses futuros
Indicadores preocupantes

<br>

6) Recomendações (consultoria prática e realista)

Sugestões de melhorias concretas
Ações rápidas que o gestor pode tomar
Estratégias para redução de custos
Orientações para o próximo mês
Escreva como uma consultoria profissional paga

<br>

REGRAS DE ESTILO

Texto claro, profissional e acessível
Pode criticar, alertar e recomendar ações sem medo
Seja específico — nada de frases genéricas como “deve-se avaliar”
NUNCA invente dados
Baseie tudo no que foi fornecido
Relatório longo: equivalente a 2 a 5 minutos de leitura

SAÍDA

Entregue somente o texto final em HTML conforme as regras acima.
Não inclua:
JSON
explicações
comentários
markdown
nada além do texto final

Dados base:
\`\`\`json
${JSON.stringify(dadosParaIA, null, 2)}
\`\`\`
        `;

        // 4) OpenAI
        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: prompt
        });

        const textoGerado = response.output_text;

        // 5) Salvar no banco
        const atualizado = await prismaClient.observacoesBi.upsert({
            where: { businessIntelligence_id: bi_id },
            update: { conteudo: textoGerado },
            create: {
                businessIntelligence_id: bi_id,
                conteudo: textoGerado
            }
        });

        return { conteudo: atualizado.conteudo };
    }
}

export { GenerateReportBiService };
