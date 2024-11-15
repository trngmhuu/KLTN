import React, { useState } from 'react';
import PageTitle from '../pageTitle/PageTitle';
import './mainApproveTour.css';
import SearchTableApproveTour from './SearchTableApproveTour/SearchTableApproveTour';
import UpdateApproveTourForm from './UpdateApproveTourForm/UpdateApproveTourForm';

function MainApproveTour() {
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
            <PageTitle page={currentComponent === 'list' ? 'Duyệt tour' : currentComponent === 'update' ? 'Cập nhật Tour' : 'Thêm Tour'} />
            {
                currentComponent === 'list' ? (
                    <SearchTableApproveTour changeComponent={handleComponentChange} onEditTour={handleComponentChange} />
                ) : currentComponent === 'update' ? (
                    <UpdateApproveTourForm changeComponent={handleComponentChange} tourCode={selectedTourCode} />
                ) : null
            }
        </main>
    );
}

export default MainApproveTour;
