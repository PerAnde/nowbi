// Formatar valor
export const formatarValor = (valor) => {
    // Remove tudo que não é número
    valor = valor.replace(/\D/g, "");

    // Converte para número e formata para reais
    valor = (Number(valor) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return valor;
};

// Remover formatacao
export const removerFormatacaoMoeda = (valor) => {
    return Number(valor.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

// Formata escrita do Mes
export const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};