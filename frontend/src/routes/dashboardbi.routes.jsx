import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { DashboardBiLayout } from '../layout/LayoutBi/DashboardBiLayout'
import { ResumoBi } from '../pages/private/pagesBi/ResumoBi/ResumoBi'
import { DetalhesBi } from '../pages/private/pagesBi/DetalhesBi/DetalhesBi'
import { DfcBi } from '../pages/private/pagesBi/Dfc/DfcBi'

export const DashboardBiRoutes = () => (
    <Route path="/dashboardbi/:link_bi/*" element={<DashboardBiLayout />}>
        <Route index element={<Navigate to="resumo" replace />} />
        <Route path="resumo" element={<ResumoBi />} />
        <Route path="detalhes" element={<DetalhesBi />} />
        <Route path="dre" element={<DfcBi />} />
        <Route path='*' element={<Navigate to="/notfound" />} />
    </Route>
)