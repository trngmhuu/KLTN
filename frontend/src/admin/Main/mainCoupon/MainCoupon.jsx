import React from 'react'
import PageTitle from '../pageTitle/PageTitle'
import './mainCoupon.css'
import SearchTableCoupon from './SearchTableCoupon/SearchTableCoupon'



function MainCoupon() {
    return (
        <main id="main" className="main">
            <PageTitle page="Quản lý Coupon" />
            <SearchTableCoupon />
        </main>
    )
}

export default MainCoupon