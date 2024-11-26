import React, { useState } from 'react';
import PageTitle from '../pageTitle/PageTitle';
import './mainTour.css';
import SearchTableTour from './SearchTableTour/SearchTableTour';
import AddTourForm from './AddTourForm/AddTourForm';
import UpdateTourForm from './UpdateTourForm/UpdateTourForm';

import TourDescriptionForm from './TourDescriptionForm/TourDescriptionForm'; // Import component mới

function MainTour() {
    const [currentComponent, setCurrentComponent] = useState('list');
    const [animation, setAnimation] = useState('slide-in');
    const [selectedTourCode, setSelectedTourCode] = useState(null);

    const handleComponentChange = (component, tourCode = null) => {
        setAnimation('slide-out');
        setTimeout(() => {
            setCurrentComponent(component);
            setSelectedTourCode(tourCode);
            setAnimation('slide-in');
        }, 300);
    };

    return (
        <main id="main" className={`main ${animation}`}>
            <PageTitle page={
                currentComponent === 'list' ? 'Quản lý Tour' :
                    currentComponent === 'update' ? 'Cập nhật Tour' :
                        currentComponent === 'description' ? 'Mô tả Tour' :
                            'Thêm Tour'
            } />
            {currentComponent === 'list' ? (
                <SearchTableTour changeComponent={handleComponentChange} />
            ) : currentComponent === 'update' ? (
                <UpdateTourForm changeComponent={handleComponentChange} tourCode={selectedTourCode} />
            ) : currentComponent === 'description' ? (
                <TourDescriptionForm changeComponent={handleComponentChange} tourCode={selectedTourCode} />
            ) : (
                <AddTourForm changeComponent={handleComponentChange} />
            )}
        </main>
    );
}

export default MainTour;