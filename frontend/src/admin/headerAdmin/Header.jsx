import React, { useState, useEffect } from 'react';
import './header.css';
import Logo from './logo/Logo';
import Nav from './nav/Nav';
import { useNotifications } from '../../context/NotificationContext';

function Header() {
    const { notifications, clearNotifications, markAllRead, unreadCount, isRead } = useNotifications(); // Thêm isRead vào đây
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    // Lấy quyền người dùng từ localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo?.roles.includes('ADMIN');

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const markAllAsRead = () => {
        markAllRead(); // Đánh dấu tất cả thông báo là đã đọc
    };

    // Hàm để định dạng timestamp thành ngày giờ dễ đọc
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

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
                                    // Sắp xếp mảng notifications theo thời gian (mới nhất xếp trước)
                                    notifications
                                        .sort((a, b) => b.timestamp - a.timestamp) // Sắp xếp theo timestamp, b - a để mới nhất xếp trên
                                        .map((notification, index) => (
                                            <div
                                                key={index}
                                                className={`notification-item ${isRead(notification.id) ? 'read' : 'unread'}`}
                                            >
                                                <div>{notification.message}</div>
                                                {/* Hiển thị ngày giờ */}
                                                <div className="notification-time">
                                                    {formatTimestamp(notification.timestamp)}
                                                </div>
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
