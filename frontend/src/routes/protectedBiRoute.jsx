import React from 'react'
import { useParams, Navigate, useLocation } from 'react-router-dom'
import { DashboardBiLayout } from '../layout/LayoutBi/DashboardBiLayout'

export const ProtectedBiRoute = () => {
    const { link_bi } = useParams()
    const location = useLocation()

    const authenticatedLink = sessionStorage.getItem('authenticated_bi_link')

    const isAuthenticated = authenticatedLink === link_bi

    if (!isAuthenticated) {
        return (
            <Navigate
                to={`/dashboardbi/${link_bi}/login`}
                state={{ from: location }}
                replace
            />
        )
    }

    return <DashboardBiLayout />
}