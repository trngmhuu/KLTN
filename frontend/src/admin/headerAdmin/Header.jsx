import React, { useState } from 'react';
import './header.css';
import Logo from './logo/Logo';
import Nav from './nav/Nav';
import { useNotifications } from '../../context/NotificationContext';

function Header() {
    const { notifications, clearNotifications } = useNotifications(); // Sử dụng clearNotifications
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    return (
        <header id='header' className='header fixed-top d-flex align-items-center'>
            <Logo />
            <div className='header__section d-flex'>
                <span className='bell' onClick={toggleDropdown}>
                    <i className='ri-notification-line'></i>
                    {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
                    {isDropdownVisible && (
                        <div className="notification-dropdown">
                            <div className="notification-header">
                                <span>Thông báo</span>
                                <button className="clear-btn" onClick={clearNotifications}>
                                    Xóa tất cả
                                </button>
                            </div>
                            <div className="notification-list">
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <div key={index} className="notification-item">
                                            {notification}
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
