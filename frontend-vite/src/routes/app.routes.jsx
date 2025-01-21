import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout privado
import { PrivateRoutes } from './private.routes'

import { Login } from '../pages/public/Login/Login';
import { Cadastro } from '../pages/public/Cadastro/Cadastro';

import { Dashboard } from '../pages/private/Dashboard/Dashboard';

import { NovaEmpresa } from '../pages/private/NovaEmpresa/NovaEmpresa';
import { Empresas } from '../pages/private/Empresas/Empresas';
import { EditarEmpresa } from '../pages/private/EditarEmpresa/EditarEmpresa';

import { MinhaConta } from '../pages/private/MinhaConta/MinhaConta';
import { Financeiro } from '../pages/private/Financeiro/Financeiro';
import { Suporte } from '../pages/private/Suporte/Suporte';

import { NotFound } from '../pages/private/errors/NotFound';

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />

                <Route path='/user' element={<PrivateRoutes><MinhaConta /></PrivateRoutes>} />

                <Route path='/dashboard' element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
                <Route path='/novaempresa' element={<PrivateRoutes><NovaEmpresa /></PrivateRoutes>} />
                <Route path='/empresas' element={<PrivateRoutes><Empresas /></PrivateRoutes>} />
                <Route path='/empresas/:id' element={<PrivateRoutes><EditarEmpresa /></PrivateRoutes>} />
                <Route path='/financeiro' element={<PrivateRoutes><Financeiro /></PrivateRoutes>} />
                <Route path='/suporte' element={<PrivateRoutes><Suporte /></PrivateRoutes>} />

                <Route path='/notfound' element={<PrivateRoutes><NotFound /></PrivateRoutes>} />
                <Route path='*' element={<Navigate to="/notfound" />} />
            </Routes>
        </Router>
    )
}