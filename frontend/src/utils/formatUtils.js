// Formatar valor dos inputs
export const formatarValor = (valor) => {
    if (typeof valor === 'number') {
        // Valor vindo direto do banco (número decimal)
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
        });
    }

    // Valor vindo de input do usuário (string formatada ou digitada)
    valor = valor.replace(/\D/g, "");
    return (Number(valor) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

// Formatar valor do banco
export const formatarValorExibicao = (valor) => {
  if (valor == null) return "-";
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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

export const diminuiTexto = (text, limit = 15) => {
    if (!text) return "";
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
};