import React from 'react'
import PageTitle from '../pageTitle/PageTitle'
import './mainTourType.css'
import SearchTableTourType from './SearchTableTourType/SearchTableTourType'


function MainTourType() {
    return (
        <main id="main" className="main">
            <PageTitle page="Quản lý danh mục tour" />
            <SearchTableTourType />
        </main>
    )
}

export default MainTourType