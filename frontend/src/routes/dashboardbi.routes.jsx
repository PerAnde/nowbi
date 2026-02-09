import React from 'react'
import { Route, Navigate, Outlet } from 'react-router-dom'

import { ProtectedBiRoute } from './protectedBiRoute'
import { BiPublicProvider } from '../contexts/BiPublicContext'

import { LoginBi } from '../pages/private/pagesBi/LoginBi/LoginBi'

import { ResumoBi } from '../pages/private/pagesBi/ResumoBi/ResumoBi'
import { DetalhesBi } from '../pages/private/pagesBi/DetalhesBi/DetalhesBi'
import { DfcBi } from '../pages/private/pagesBi/Dfc/DfcBi'

export const DashboardBiRoutes = () => (
    <Route element={
        <BiPublicProvider>
            <Outlet />
        </BiPublicProvider>
    }>

        <Route path="/dashboardbi/:link_bi/login" element={<LoginBi />} />

        <Route path="/dashboardbi/:link_bi/*" element={<ProtectedBiRoute />}>
            <Route index element={<Navigate to="resumo" replace />} />
            <Route path="resumo" element={<ResumoBi />} />
            <Route path="detalhes" element={<DetalhesBi />} />
            <Route path="dfc" element={<DfcBi />} />
            <Route path="dre" element={<DfcBi />} />
            <Route path="relatorio" element={<DfcBi />} />
            <Route path='*' element={<Navigate to="/notfound" />} />
        </Route>
    </Route>
)