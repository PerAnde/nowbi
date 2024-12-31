import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout privado
import { PrivateRoutes } from './private.routes'

import { Login } from '../pages/public/Login/Login';
import { Cadastro } from '../pages/public/Cadastro/Cadastro';

import { Dashboard } from '../pages/private/Dashboard/Dashboard';

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />
                <Route path='/' element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
            </Routes>
        </Router>
    )
}