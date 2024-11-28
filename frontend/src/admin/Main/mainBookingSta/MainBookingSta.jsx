import React from 'react'
import PageTitle from '../pageTitle/PageTitle'
import SearchBookingStat from './SearchBookingSta/SearchBookingStat'

function MainBookingSta() {
    return (
        <main id="main" className="main">
            <PageTitle page="Doanh thu theo ngày" />
            <SearchBookingStat />
        </main>
    )
}

export default MainBookingSta