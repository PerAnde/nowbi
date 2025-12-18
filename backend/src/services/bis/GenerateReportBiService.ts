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
Retorne a resposta EXATAMENTE igual ao conteudo abaixo inclusive as div e classes:
Não precisa mostrar colocar marcação para mostrar que é um HTML.

<div class="container">

        <header>
            <div class="brand">
                <h1>Água Marinha</h1>
                <small>Relatório Financeiro</small>
            </div>
            <div class="periodo">Outubro / 2025</div>
        </header>

        <h2>Resumo Executivo</h2>
        <p>O mês apresentou desempenho que requer atenção: receitas totais de R$ 396.670,06 e despesas totais de R$
            341.451,98, resultando em lucro líquido de <strong>R$ 55.218,08</strong>. A saúde financeira é classificada
            como moderada.</p>

        <div class="metrics">
            <div class="metric">
                <h3>Receitas Totais</h3>
                <div class="value green">R$ 396.670,06</div>
            </div>
            <div class="metric">
                <h3>Despesas Totais</h3>
                <div class="value red">R$ 341.451,98</div>
            </div>
            <div class="metric">
                <h3>Lucro Líquido</h3>
                <div class="value">R$ 55.218,08</div>
            </div>
        </div>

        <h2>Principais Destaques</h2>

        <h3 style="margin-top:20px;color:var(--azul)">Receitas</h3>
        <p>Recebimentos a prazo foram o maior contribuidor, enquanto receitas à vista apresentaram liquidez moderada.
        </p>

        <h3 style="margin-top:20px;color:var(--azul)">Despesas</h3>
        <p>Custos de mercadorias e despesas com pessoal foram os principais gastos do mês.</p>


        <h2>Análise de Receitas</h2>
        <table>
            <tr>
                <th>Categorias</th>
                <th>Valor (R$)</th>
            </tr>
            <tr>
                <td>Recebimento a Prazo</td>
                <td>R$ 293.634,98</td>
            </tr>
            <tr>
                <td>Recebimentos à Vista</td>
                <td>R$ 41.151,30</td>
            </tr>
            <tr>
                <td>Outras Receitas</td>
                <td>R$ 330,14</td>
            </tr>
        </table>
        <p style="margin-top:8px;">As receitas foram impulsionadas principalmente pelos recebimentos a prazo, indicando
            dependência considerável desse canal.</p>


        <h2>Análise de Despesas</h2>
        <table>
            <tr>
                <th>Categorias</th>
                <th>Valor (R$)</th>
            </tr>
            <tr>
                <td>Custos (compra de mercadorias)</td>
                <td>R$ 214.593,19</td>
            </tr>
            <tr>
                <td>Despesas com Pessoal</td>
                <td>R$ 41.745,32</td>
            </tr>
            <tr>
                <td>Despesas Administrativas</td>
                <td>R$ 22.002,56</td>
            </tr>
        </table>
        <p style="margin-top:8px;">Os custos de mercadorias foram os mais altos e demandam controle mais rigoroso.
            Despesas administrativas e de pessoal também requerem revisão.</p>


        <h2>Pontos de Atenção</h2>
        <p class="lista-alertas">
        <p>• Crescimento das despesas com pessoal reduzindo margem.</p>
        <p>• Dependência excessiva de recebimentos a prazo.</p>
        <p>• Despesas administrativas em alta sugerem ineficiência operacional.</p>
        <p>• Gastos com brindes e patrocínios sem retorno mensurável.</p>
        </p>


        <h2>Recomendações</h2>
        <ul>
            <li>Revisar quadro de pessoal e analisar redistribuição de funções.</li>
            <li>Fortalecer negociação com fornecedores e gestão de estoque.</li>
            <li>Buscar diversificação das fontes de receita.</li>
            <li>Rever gastos com patrocínios e priorizar ações com retorno real.</li>
        </ul>


        <h2>Conclusão</h2>
        <p class="conclusao">O lucro de R$ 55.218,08 demonstra resultado positivo, porém com margem apertada.
            Recomenda-se a implementação das ações acima para reforçar a saúde financeira da empresa.</p>

    </div>

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
