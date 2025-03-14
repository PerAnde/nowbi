import { useState } from "react"

export const useMeses = () => {

    const [meses] = useState([
        { id: 1, value: "JANEIRO", label: "Janeiro" },
        { id: 2, value: "FEVEREIRO", label: "Fevereiro" },
        { id: 3, value: "MARÇO", label: "Março" },
        { id: 4, value: "ABRIL", label: "Abril" },
        { id: 5, value: "MAIO", label: "Maio" },
        { id: 6, value: "JUNHO", label: "Junho" },
        { id: 7, value: "JULHO", label: "Julho" },
        { id: 8, value: "AGOSTO", label: "Agosto" },
        { id: 9, value: "SETEMBRO", label: "Setembro" },
        { id: 10, value: "OUTUBRO", label: "Outubro" },
        { id: 11, value: "NOVEMBRO", label: "Novembro" },
        { id: 12, value: "DEZEMBRO", label: "Dezembro" },
    ])
    return { meses };

}