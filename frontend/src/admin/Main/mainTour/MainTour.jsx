import React, { useState } from 'react';
import PageTitle from '../pageTitle/PageTitle';
import './mainTour.css';
import SearchTableTour from './SearchTableTour/SearchTableTour';
import AddTourForm from './AddTourForm/AddTourForm';
import UpdateTourForm from './UpdateTourForm/UpdateTourForm';

function MainTour() {
    const [currentComponent, setCurrentComponent] = useState('list'); // State điều khiển component
    const [animation, setAnimation] = useState('slide-in'); // State cho hiệu ứng chuyển động
    const [selectedTourCode, setSelectedTourCode] = useState(null); // State để lưu mã tour được chọn

    const handleComponentChange = (component, tourCode = null) => {
        setAnimation('slide-out'); // Bắt đầu hiệu ứng trượt ra
        setTimeout(() => {
            setCurrentComponent(component); // Đổi component sau khi hoàn tất hiệu ứng
            setSelectedTourCode(tourCode); // Lưu mã tour để cập nhật
            setAnimation('slide-in'); // Reset hiệu ứng về trượt vào
        }, 300); // Thời gian khớp với animation CSS
    };

    return (
        <main id="main" className={`main ${animation}`}>
            <PageTitle page={currentComponent === 'list' ? 'Quản lý Tour' : currentComponent === 'update' ? 'Cập nhật Tour' : 'Thêm Tour'} />
            {currentComponent === 'list' ? (
                <SearchTableTour changeComponent={handleComponentChange} onEditTour={handleComponentChange} />
            ) : currentComponent === 'update' ? (
                <UpdateTourForm changeComponent={handleComponentChange} tourCode={selectedTourCode} />
            ) : (
                <AddTourForm changeComponent={handleComponentChange} />
            )}
        </main>
    );
}

export default MainTour;
