import { gruposDeDFC } from "./gruposDeDFC";

export const agruparDadosDfcHorizontal = (dfc12Meses) => {
    const { colunasCabecalho, linhas } = dfc12Meses;
    const numMeses = colunasCabecalho.length;

    const somarArrays = (a, b) => a.map((val, i) => {
        const soma = (val || 0) + (b[i] || 0);
        return Math.round(soma * 100) / 100;
    });

    const getTotaisPorTipo = (tipoBuscado) => {
        let totais = new Array(numMeses).fill(0);
        const linhasFiltradas = linhas.filter(l => l.tipo === tipoBuscado);
        linhasFiltradas.forEach(l => {
            const valores = l.valoresPorMes.map(v => v.valor);
            totais = somarArrays(totais, valores);
        });
        return totais;
    };

    const resultado = [];

    gruposDeDFC.forEach((grupo) => {
        const totaisGrupo = getTotaisPorTipo(grupo.grupo);
        const categoriasMap = {};

        // Mapeamento de categorias e subcategorias (mesma lógica)
        linhas.filter(l => l.tipo === grupo.grupo).forEach(l => {
            const catNome = l.categoria;
            const subNome = l.subcategoria;
            const valoresLinha = l.valoresPorMes.map(v => v.valor);
            if (valoresLinha.some(v => v > 0)) {
                if (!categoriasMap[catNome]) {
                    categoriasMap[catNome] = {
                        total: new Array(numMeses).fill(0),
                        subcategorias: []
                    };
                }
                categoriasMap[catNome].total = somarArrays(categoriasMap[catNome].total, valoresLinha);
                categoriasMap[catNome].subcategorias.push({
                    nome: subNome,
                    valores: valoresLinha
                });
            }
        });

        const categoriasFiltradas = {};
        Object.entries(categoriasMap).forEach(([nome, dados]) => {
            if (dados.total.some(v => v > 0)) {
                categoriasFiltradas[nome] = dados;
            }
        });

        // Adiciona o grupo principal (exceto se for o Saldo de Caixa final, que trataremos no fim)
        if (grupo.grupo !== 'SALDO_DE_CAIXA') {
            resultado.push({
                titulo: grupo.titulo,
                tipo: grupo.grupo,
                valores: totaisGrupo,
                isResultado: false,
                categorias: categoriasFiltradas
            });
        }

        // --- CÁLCULOS DE RESULTADO ---

        // 1. Receita Líquida
        if (grupo.grupo === 'DEDUCOES_DA_RECEITA_BRUTA') {
            const rb = getTotaisPorTipo('RECEITA_OPERACIONAL_BRUTA');
            const ded = getTotaisPorTipo('DEDUCOES_DA_RECEITA_BRUTA');
            resultado.push({
                titulo: 'Receita Operacional Líquida (=)',
                valores: rb.map((v, i) => v - ded[i]),
                isResultado: true
            });
        }

        // 2. Resultado Bruto
        if (grupo.grupo === 'CUSTO_VARIAVEL') {
            const rb = getTotaisPorTipo('RECEITA_OPERACIONAL_BRUTA');
            const ded = getTotaisPorTipo('DEDUCOES_DA_RECEITA_BRUTA');
            const cv = getTotaisPorTipo('CUSTO_VARIAVEL');
            resultado.push({
                titulo: 'Resultado Bruto',
                valores: rb.map((v, i) => (v - ded[i]) - cv[i]),
                isResultado: true
            });
        }

        // 3. Saldo Operacional, Outras Receitas e IR/CSLL
        if (grupo.grupo === 'OUTRAS_DESPESAS') {
            const rb = getTotaisPorTipo('RECEITA_OPERACIONAL_BRUTA');
            const ded = getTotaisPorTipo('DEDUCOES_DA_RECEITA_BRUTA');
            const cv = getTotaisPorTipo('CUSTO_VARIAVEL');
            const despOp = getTotaisPorTipo('DESPESAS_OPERACIONAIS');
            const despVar = getTotaisPorTipo('DESPESAS_VARIAVEIS');
            const despFin = getTotaisPorTipo('DESPESAS_FINANCEIRAS');
            const outDesp = getTotaisPorTipo('OUTRAS_DESPESAS');

            // Cálculo Saldo Operacional
            const saldoOp = rb.map((v, i) =>
                ((v - ded[i]) - cv[i]) - despOp[i] - despVar[i] - despFin[i] - outDesp[i]
            );

            resultado.push({
                titulo: 'Saldo de Caixa Operacional',
                valores: saldoOp,
                isResultado: true
            });

            // Adiciona Outras Receitas (Grupo Dinâmico)
            const outRecTotais = getTotaisPorTipo('OUTRAS_RECEITAS');
            if (outRecTotais.some(v => v > 0)) {
                resultado.push({
                    titulo: 'Outras Receitas',
                    tipo: 'OUTRAS_RECEITAS',
                    valores: outRecTotais,
                    isResultado: false,
                    categorias: {} // Se precisar de categorias aqui, teria que replicar a lógica de map acima
                });
            }

            // Adiciona IR e CSLL
            const irTotais = getTotaisPorTipo('IR_CSLL');
            if (irTotais.some(v => v > 0)) {
                resultado.push({
                    titulo: 'IR e CSLL',
                    tipo: 'IR_CSLL',
                    valores: irTotais,
                    isResultado: false,
                    categorias: {}
                });
            }

            // Saldo de Caixa Final (+/-)
            resultado.push({
                titulo: 'Saldo de Caixa (+/-)',
                valores: saldoOp.map((v, i) => v + outRecTotais[i] - irTotais[i]),
                isResultado: true
            });
        }
    });

    return { cabecalho: colunasCabecalho, dados: resultado };
};