import React, { useState } from 'react';
import PageTitle from '../pageTitle/PageTitle';
import './mainBooking.css';
import SearchTableBooking from './SearchTableBooking/SearchTableBooking';
import AddBookingForm from './AddBookingForm/AddBookingForm';
import UpdateBookingForm from './UpdateBookingForm/UpdateBookingForm';

function MainBooking() {
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
            <PageTitle page={currentComponent === 'list' ? 'Quản lý Booking' : currentComponent === 'update' ? 'Cập nhật Booking' : 'Thêm Booking'} />
            {currentComponent === 'list' ? (
                <SearchTableBooking changeComponent={handleComponentChange} onEditBooking={handleComponentChange} />
            ) : currentComponent === 'update' ? (
                <UpdateBookingForm changeComponent={handleComponentChange} bookingCode={selectedBookingCode} />
            ) : (
                <AddBookingForm changeComponent={handleComponentChange} />
            )}
        </main>
    );
}

export default MainBooking;
