export const calcularDiasRestantes = (dataFinal) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas os dias
    
    const dataExpira = new Date(dataFinal);
    dataExpira.setHours(0, 0, 0, 0);
    
    // Diferença em milissegundos
    const diferencaTempo = dataExpira.getTime() - hoje.getTime();
    
    // Converte milissegundos em dias
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
    
    return diferencaDias;
};