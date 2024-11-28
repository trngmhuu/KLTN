import React from 'react'
import './mainDashboard.css'
import PageTitle from '../pageTitle/PageTitle'
import Dashboard from './dashboard/Dashboard'


function MainDashboard() {
    return (
        <main id="main" className="main">
            <PageTitle page="Tổng quan" />
            <Dashboard />
            <div style={{ width: '100%', height: 400 }}>
                <h3>Chúc ngày tốt đẹp HIHI</h3>

            </div>
        </main>
    )
}

export default MainDashboard