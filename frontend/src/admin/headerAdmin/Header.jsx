import React, { useState, useEffect } from 'react';
import './header.css';
import Logo from './logo/Logo';
import Nav from './nav/Nav';
import { useNotifications } from '../../context/NotificationContext';

function Header() {
    const { notifications, clearNotifications, markAllRead } = useNotifications(); // Sử dụng clearNotifications
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); // Bộ đếm thông báo chưa đọc

    // Lấy quyền người dùng từ localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo?.roles.includes('ADMIN');

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const markAllAsRead = () => {
        markAllRead(); // Đánh dấu tất cả thông báo là đã đọc
    };

    // Đồng bộ lại bộ đếm thông báo chưa đọc khi có thay đổi trong notifications
    useEffect(() => {
        // Cập nhật lại bộ đếm chưa đọc
        const unread = notifications.filter(notification => !notification.isRead).length;
        setUnreadCount(unread);
    }, [notifications]); // Khi notifications thay đổi, cập nhật lại bộ đếm

    return (
        <header id='header' className='header fixed-top d-flex align-items-center'>
            <Logo />
            <div className='header__section d-flex'>
                <span className='bell' onClick={toggleDropdown}>
                    <i className='ri-notification-line'></i>
                    {unreadCount > 0 && 
                        <span className="notification-count">{unreadCount}</span>
                    }
                    {isDropdownVisible && (
                        <div className="notification-dropdown">
                            <div className="notification-header">
                                <span>Thông báo</span>
                                <div className="notification-actions">
                                    {isAdmin && (
                                        <button className="clear-btn" onClick={clearNotifications}>
                                            Xóa tất cả
                                        </button>
                                    )}
                                    <button className="mark-read-btn" onClick={markAllAsRead}>
                                        Đánh dấu tất cả là đã đọc
                                    </button>
                                </div>
                            </div>
                            <div className="notification-list">
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <div key={index} className="notification-item">
                                            {/* Render chỉ nội dung message */}
                                            {notification.message}
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-notifications">Không có thông báo</div>
                                )}
                            </div>
                        </div>
                    )}
                </span>
            </div>
            <Nav />
        </header>
    );
}

export default Header;
