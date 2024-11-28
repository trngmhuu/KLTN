import React from 'react'
import PageTitle from '../pageTitle/PageTitle'
import SearchBookingStat from './SearchCustomerSta/SearchCustomerStat'
import SearchCustomerStat from './SearchCustomerSta/SearchCustomerStat'

function MainCustomerSta() {
    return (
        <main id="main" className="main">
            <PageTitle page="Thống kê doanh thu khách hàng" />
            <SearchCustomerStat />
        </main>
    )
}

export default MainCustomerSta