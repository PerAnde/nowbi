import { agruparPorGrupo } from "./agruparPorGrupo";
import { gruposDeDFC } from "./gruposDeDFC";

export const agruparDadosDfc = (dados) => {
    const dadosAgrupados = agruparPorGrupo(dados);
    const resultado = [];

    const getTotal = (grupo) => dadosAgrupados[grupo]?.total || 0;

    gruposDeDFC.forEach((grupo, index) => {
        const grupoDados = dadosAgrupados[grupo.grupo];
        if (grupoDados) {
            resultado.push({
                ...grupo,
                dados: grupoDados
            });
        }

        // Depois de DEDUCOES_DA_RECEITA_BRUTA, inserir Receita Operacional Líquida
        if (grupo.grupo === 'DEDUCOES_DA_RECEITA_BRUTA') {
            const receitaBruta = getTotal('RECEITA_OPERACIONAL_BRUTA');
            const deducoes = getTotal('DEDUCOES_DA_RECEITA_BRUTA');

            resultado.push({
                titulo: 'Receita Operacional Líquida (=)',
                grupo: 'RESULTADO_RECEITA_LIQUIDA',
                dados: {
                    total: receitaBruta - deducoes,
                    categorias: {}
                },
                isResultado: true
            });
        }

        // Depois de CUSTO_VARIAVEL, inserir Receita Bruto
        if (grupo.grupo === 'CUSTO_VARIAVEL') {
            const receitaBruta = getTotal('RECEITA_OPERACIONAL_BRUTA');
            const deducoes = getTotal('DEDUCOES_DA_RECEITA_BRUTA');
            const custoVariavel = getTotal('CUSTO_VARIAVEL');
            const receitaLiquida = receitaBruta - deducoes;

            resultado.push({
                titulo: 'Resultado Bruto',
                grupo: 'RESULTADO_BRUTO',
                dados: {
                    total: receitaLiquida - custoVariavel,
                    categorias: {}
                },
                isResultado: true
            });
        }

        // Após OUTRAS_DESPESAS, inserir LUCRO/PREJUIZO OPERACIONAL
        if (grupo.grupo === 'OUTRAS_DESPESAS') {
            const receitaBruta = getTotal('RECEITA_OPERACIONAL_BRUTA');
            const deducoes = getTotal('DEDUCOES_DA_RECEITA_BRUTA');
            const custoVariavel = getTotal('CUSTO_VARIAVEL');
            const despesasOperacionais = getTotal('DESPESAS_OPERACIONAIS');
            const despesasVariaveis = getTotal('DESPESAS_VARIAVEIS');
            const despesasFinanceiras = getTotal('DESPESAS_FINANCEIRAS');
            const outrasDespesas = getTotal('OUTRAS_DESPESAS');
            const outrasReceitas = dadosAgrupados['OUTRAS_RECEITAS'];
            const totalOutrasReceitas = outrasReceitas?.total || 0;
            const irCsll = dadosAgrupados['IR_CSLL'];
            const totalIrCsll = getTotal('IR_CSLL');

            // Cálculo do lucro operacional
            const receitaLiquida = receitaBruta - deducoes;
            const lucroBruto = receitaLiquida - custoVariavel;
            const totalLucroPrejuizoOperacional = lucroBruto - despesasOperacionais - despesasVariaveis - despesasFinanceiras - outrasDespesas;

            resultado.push({
                titulo: 'Saldo de Caixa Operacional',
                grupo: 'SALDO_DE_CAIXA_OPERACIONAL',
                dados: {
                    total: totalLucroPrejuizoOperacional,
                    categorias: {}
                },
                isResultado: true
            });

            if (outrasReceitas) {
                resultado.push({
                    titulo: 'Outras Receitas',
                    grupo: 'OUTRAS_RECEITAS',
                    dados: outrasReceitas
                });
            }

            // Lucro Líquido Antes do IR = Operacional + Outras Receitas
            const lucroAntesIR = totalLucroPrejuizoOperacional + totalOutrasReceitas;

            if (irCsll) {
                resultado.push({
                    titulo: 'IR e CSLL',
                    grupo: 'IR_CSLL',
                    dados: irCsll,
                    isResultado: false
                });
            }

            // Lucro/Prejuízo Acumulado = Lucro Antes IR - IR e CSLL
            resultado.push({
                titulo: 'Saldo de Caixa (+/-)',
                grupo: 'SALDO_DE_CAIXA',
                dados: {
                    total: lucroAntesIR - totalIrCsll,
                    categorias: {}
                },
                isResultado: true
            });
        }

    });

    return resultado;
};