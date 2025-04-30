import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout privado
import { PrivateRoutes } from './private.routes'

// Rotas Publicas
import { Login } from '../pages/public/Login/Login';
import { Cadastro } from '../pages/public/Cadastro/Cadastro';
// Rotas Privadas Usuario
import { MinhaConta } from '../pages/private/MinhaConta/MinhaConta';
import { Financeiro } from '../pages/private/Financeiro/Financeiro';
import { Planos } from '../pages/private/Planos/Planos';
import { Suporte } from '../pages/private/Suporte/Suporte';
// Rotas Privadas Sistema
import { Dashboard } from '../pages/private/Dashboard/Dashboard';
import { Empresas } from '../pages/private/Empresas/Empresas';
import { Empresa } from '../pages/private/Empresa/Empresa';
import { Categorias } from '../pages/private/Categorias/Categorias';
import { Bi } from '../pages/private/Bi/Bi';
// Rotas Dashboard BI
import { DashboardBi } from '../pages/private/pagesBi/DashboardBi/DashboardBi';
// Rotas Erros
import { NotFound } from '../pages/private/errors/NotFound';

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Rotas Publicas */}
                <Route path='/' element={<Login />} />
                {/* <Route path='/cadastro' element={<Cadastro />} /> */}
                {/* Rotas Privadas Usuario */}
                <Route path='/user' element={<PrivateRoutes><MinhaConta /></PrivateRoutes>} />
                {/* <Route path='/financeiro' element={<PrivateRoutes><Financeiro /></PrivateRoutes>} /> */}
                <Route path='/planos' element={<PrivateRoutes><Planos /></PrivateRoutes>} />
                <Route path='/suporte' element={<PrivateRoutes><Suporte /></PrivateRoutes>} />
                {/* Rotas Privadas Sistema */}
                <Route path='/dashboard' element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
                <Route path='/empresas' element={<PrivateRoutes><Empresas /></PrivateRoutes>} />
                <Route path='/empresas/:id' element={<PrivateRoutes><Empresa /></PrivateRoutes>} />
                <Route path='/empresas/grupo/:id' element={<PrivateRoutes><Empresa /></PrivateRoutes>} />
                <Route path='/categorias' element={<PrivateRoutes><Categorias /></PrivateRoutes>} />
                <Route path='/bi/:id' element={<PrivateRoutes><Bi /></PrivateRoutes>} />
                {/* Rotas Dashboard BI */}
                <Route path='/dashboardbi/:link_bi' element={<DashboardBi />} />
                <Route path='/entradasbi' element={<DashboardBi />} />
                <Route path='/saidasbi' element={<DashboardBi />} />
                <Route path='/detalhesbi' element={<DashboardBi />} />
                {/* Rotas Erros */}
                <Route path='/notfound' element={<PrivateRoutes><NotFound /></PrivateRoutes>} />
                <Route path='*' element={<Navigate to="/notfound" />} />
            </Routes>
        </Router>
    )
}