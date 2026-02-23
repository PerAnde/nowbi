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
import { CategoriasEmpresa } from '../pages/private/Categorias/CategoriasEmpresa/CategoriasEmpresa';
import { Ajuda } from '../pages/private/Ajuda/Ajuda';
import { Tutoriais } from '../pages/private/Tutoriais/Tutoriais';
import { Integracao } from '../pages/private/Integracao/Integracao';
import { Bi } from '../pages/private/Bi/Bi';
// Rotas Dashboard BI
import { DashboardBiRoutes } from './dashboardbi.routes'
// Rotas Erros
import { NotFound } from '../pages/private/errors/NotFound';

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Rotas Publicas */}
                <Route path='/' element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />
                {/* Rotas Privadas Usuario */}
                <Route path='/user' element={<PrivateRoutes><MinhaConta /></PrivateRoutes>} />
                {/* <Route path='/financeiro' element={<PrivateRoutes><Financeiro /></PrivateRoutes>} /> */}
                {/* <Route path='/planos' element={<PrivateRoutes><Planos /></PrivateRoutes>} /> */}
                <Route path='/suporte' element={<PrivateRoutes><Suporte /></PrivateRoutes>} />
                {/* Rotas Privadas Sistema */}
                <Route path='/dashboard' element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
                <Route path='/empresas' element={<PrivateRoutes><Empresas /></PrivateRoutes>} />
                <Route path='/empresas/:id' element={<PrivateRoutes><Empresa /></PrivateRoutes>} />
                <Route path='/empresas/grupo/:id' element={<PrivateRoutes><Empresa /></PrivateRoutes>} />
                <Route path='/categorias' element={<PrivateRoutes><Categorias /></PrivateRoutes>} />
                <Route path='/categorias/empresa/:id' element={<PrivateRoutes><CategoriasEmpresa /></PrivateRoutes>} />
                <Route path='/ajuda' element={<PrivateRoutes><Ajuda /></PrivateRoutes>} />
                <Route path='/tutoriais' element={<PrivateRoutes><Tutoriais /></PrivateRoutes>} />
                <Route path='/integracao-status' element={<PrivateRoutes><Integracao /></PrivateRoutes>} />
                <Route path='/bi/:id' element={<PrivateRoutes><Bi /></PrivateRoutes>} />
                {/* Rotas Dashboard BI */}
                {DashboardBiRoutes()}
                {/* Rotas Erros */}
                <Route path='/notfound' element={<PrivateRoutes><NotFound /></PrivateRoutes>} />
                <Route path='*' element={<Navigate to="/notfound" />} />
            </Routes>
        </Router>
    )
}