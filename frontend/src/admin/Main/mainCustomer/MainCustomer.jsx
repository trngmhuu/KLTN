import React from 'react'
import PageTitle from '../pageTitle/PageTitle'
import './mainCustomer.css'
import SearchTableCustomer from './SearchTableCustomer/SearchTableCustomer'



function MainCustomer() {
    return (
        <main id="main" className="main">
            <PageTitle page="Quản lý khách hàng" />
            <SearchTableCustomer />
        </main>
    )
}

export default MainCustomer