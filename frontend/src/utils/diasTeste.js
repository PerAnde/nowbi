export const calcularDiasRestantes = (dataFinal) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const dataExpira = new Date(dataFinal);
    dataExpira.setHours(0, 0, 0, 0);
    
    const diferencaTempo = dataExpira.getTime() - hoje.getTime();
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
    
    return diferencaDias;
};