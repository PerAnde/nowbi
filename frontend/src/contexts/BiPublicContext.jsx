// src/context/BiPublicContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { buscarDashboardBi } from '../services/dashboardBi'
import { processaDadosBi } from '../utils/processaDadosBi'

const BiPublicContext = createContext()

export const BiPublicProvider = ({ children }) => {
    const { link_bi } = useParams()
    const navigate = useNavigate()

    const [empresa, setEmpresa] = useState(null)
    const [dashboardData, setDashboardData] = useState(null)
    const [mesSelecionado, setMesSelecionado] = useState('')
    const [anoSelecionado, setAnoSelecionado] = useState('')
    const [mesesDisponiveis, setMesesDisponiveis] = useState([])
    const [anosDisponiveis, setAnosDisponiveis] = useState([])
    const [loading, setLoading] = useState(true)

    const monthOrder = {
        "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4, "maio": 5, "junho": 6,
        "julho": 7, "agosto": 8, "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12
    }

    useEffect(() => {
        buscarDashboardBi(link_bi, setEmpresa, setLoading, navigate)
    }, [link_bi])

    useEffect(() => {
        if (!empresa || !empresa.bis.length) return

        const bisAtivos = empresa.bis.filter(bi => bi.status)
        const meses = [...new Set(bisAtivos.map(bi => bi.mes.toLowerCase()))]
            .sort((a, b) => monthOrder[a] - monthOrder[b])
        const anos = [...new Set(bisAtivos.map(bi => bi.ano))].sort()

        setMesesDisponiveis(meses)
        setAnosDisponiveis(anos)

        const ultimo = bisAtivos
            .sort((a, b) => a.ano - b.ano || monthOrder[a.mes.toLowerCase()] - monthOrder[b.mes.toLowerCase()])
            .at(-1)

        setMesSelecionado(ultimo.mes.toLowerCase())
        setAnoSelecionado(ultimo.ano)
    }, [empresa])

    useEffect(() => {
        if (!empresa || !mesSelecionado || !anoSelecionado) return

        const bisOrdenados = empresa.bis
            .filter(bi => bi.status)
            .sort((a, b) => a.ano - b.ano || monthOrder[a.mes.toLowerCase()] - monthOrder[b.mes.toLowerCase()])

        const biAtual = bisOrdenados.find(bi => bi.mes.toLowerCase() === mesSelecionado && bi.ano === anoSelecionado)
        const biAnterior = bisOrdenados[bisOrdenados.indexOf(biAtual) - 1]

        const dadosAtuais = processaDadosBi(empresa, `${biAtual.mes.toUpperCase()} / ${biAtual.ano}`)
        const dadosAnteriores = biAnterior ? processaDadosBi(empresa, `${biAnterior.mes.toUpperCase()} / ${biAnterior.ano}`) : null

        const receitaAtual = dadosAtuais.summary.receitas
        const receitaAnterior = dadosAnteriores?.summary.receitas || 0

        const despesaAtual = dadosAtuais.summary.despesas
        const despesaAnterior = dadosAnteriores?.summary.despesas || 0

        setDashboardData({
            ...dadosAtuais,
            diferencaPercentualReceita: receitaAnterior ? ((receitaAtual - receitaAnterior) / receitaAnterior) * 100 : 0,
            diferencaPercentualDespesa: despesaAnterior ? ((despesaAtual - despesaAnterior) / despesaAnterior) * 100 : 0
        })

        setLoading(false)
    }, [empresa, mesSelecionado, anoSelecionado])

    return (
        <BiPublicContext.Provider value={{
            empresa, dashboardData, mesSelecionado, anoSelecionado,
            setMesSelecionado, setAnoSelecionado,
            mesesDisponiveis, anosDisponiveis, loading
        }}>
            {children}
        </BiPublicContext.Provider>
    )
}

export const useBiPublic = () => useContext(BiPublicContext)
