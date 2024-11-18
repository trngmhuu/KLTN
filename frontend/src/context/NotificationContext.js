// NotificationContext.js
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message) => {
        setNotifications((prev) => [...prev, message]);
    };

    const clearNotifications = () => {
        setNotifications([]); // Xóa toàn bộ thông báo
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
