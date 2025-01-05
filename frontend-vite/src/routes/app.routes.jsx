import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout privado
import { PrivateRoutes } from './private.routes'

import { Login } from '../pages/public/Login/Login';
import { Cadastro } from '../pages/public/Cadastro/Cadastro';

import { Dashboard } from '../pages/private/Dashboard/Dashboard';
import { MinhaConta } from '../pages/private/MinhaConta/MinhaConta';
import { Financeiro } from '../pages/private/Financeiro/Financeiro';

import { NovoEmpresa } from '../pages/private/NovoEmpresa/NovoEmpresa';
import { Empresas } from '../pages/private/Empresas/Empresas';

import { NotFound } from '../pages/private/errors/NotFound';

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />

                <Route path='/dashboard' element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
                <Route path='/minhaconta' element={<PrivateRoutes><MinhaConta /></PrivateRoutes>} />
                <Route path='/financeiro' element={<PrivateRoutes><Financeiro /></PrivateRoutes>} />
                <Route path='/novaempresa' element={<PrivateRoutes><NovoEmpresa /></PrivateRoutes>} />
                <Route path='/empresas' element={<PrivateRoutes><Empresas /></PrivateRoutes>} />

                <Route path='/notfound' element={<PrivateRoutes><NotFound /></PrivateRoutes>} />
                <Route path='*' element={<Navigate to="/notfound" />} />
            </Routes>
        </Router>
    )
}