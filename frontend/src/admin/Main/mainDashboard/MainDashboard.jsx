import React from 'react'
import './mainDashboard.css'
import PageTitle from '../pageTitle/PageTitle'
import Dashboard from './dashboard/Dashboard'

function MainDashboard() {
    return (
        <main id="main" className="main">
            <PageTitle page="Tổng quan" />
            <Dashboard />
        </main>
    )
}

export default MainDashboard