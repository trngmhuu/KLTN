import React from 'react'
import PageTitle from '../pageTitle/PageTitle'
import './mainUser.css'
import SearchTable from './SearchTable/SearchTable'

function MainUser() {
    return (
        <main id="main" className="main">
            <PageTitle page="Quản lý người dùng" />
            <SearchTable />
        </main>
    )
}

export default MainUser