import React, { useState } from 'react';
import PageTitle from '../pageTitle/PageTitle';
import './mainCancelBooking.css';
import SearchTableCancelBooking from './SearchTableCancelBooking/SearchTableCancelBooking';
import UpdateCancelBooking from './UpdateCancelBooking/UpdateCancelBooking';

function MainCancelBooking() {
    const [currentComponent, setCurrentComponent] = useState('list'); // State điều khiển component
    const [animation, setAnimation] = useState('slide-in'); // State cho hiệu ứng chuyển động
    const [selectedBookingCode, setSelectedBookingCode] = useState(null); // State để lưu mã Booking được chọn

    const handleComponentChange = (component, bookingCode = null) => {
        setAnimation('slide-out'); // Bắt đầu hiệu ứng trượt ra
        setTimeout(() => {
            setCurrentComponent(component); // Đổi component sau khi hoàn tất hiệu ứng
            setSelectedBookingCode(bookingCode); // Lưu mã Booking để cập nhật
            setAnimation('slide-in'); // Reset hiệu ứng về trượt vào
        }, 300); // Thời gian khớp với animation CSS
    };

    return (
        <main id="main" className={`main ${animation}`}>
            <PageTitle page={currentComponent === 'list' ? 'Yêu cầu hủy booking' : currentComponent === 'update' ? 'Cập nhật Booking' : null} />
            {currentComponent === 'list' ? (
                <SearchTableCancelBooking changeComponent={handleComponentChange} onEditBooking={handleComponentChange} />
            )
            : currentComponent === 'update' ? (
                <UpdateCancelBooking changeComponent={handleComponentChange} bookingCode={selectedBookingCode} />
            ) : null
            }
        </main>
    );
}

export default MainCancelBooking;
