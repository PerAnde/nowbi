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
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Fomratar CNPJ
export const formatarCnpj = (valor) => {
    valor = valor.replace(/\D/g, "");
    return valor
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
};