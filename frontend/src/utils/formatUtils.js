export const formatarValor = (valor) => {
    if (typeof valor === 'number') {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
        });
    }

    valor = valor.replace(/\D/g, "");
    return (Number(valor) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

export const formatarValorExibicao = (valor) => {
    if (valor == null) return "-";
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const removerFormatacaoMoeda = (valor) => {
    return Number(valor.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

export const capitalizeFirstLetter = (str) => {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

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

export const formatarMesAno = (texto) => {
    if (!texto) return "";
    const [mes, ano] = texto.split(" / ");

    const mesCurto = mes.substring(0, 3).toLowerCase();
    const anoCurto = ano.slice(-4);

    return `${mesCurto.charAt(0).toUpperCase() + mesCurto.slice(1)} ${anoCurto}`;
};

export const somarArrays = (arr1, arr2) => arr1.map((num, idx) => num + (arr2[idx] || 0));

export const formatarValorZerado = (valor) => {
    if (!valor || valor === 0) {
        return "--";
    }
    return valor.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
};