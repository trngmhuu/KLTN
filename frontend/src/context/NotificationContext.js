import React, { createContext, useState, useContext, useEffect } from 'react';
import { database } from '../firebase/FirebaseConfig'; // Import cấu hình Firebase
import { ref, push, onValue, remove, update, set } from 'firebase/database'; // Firebase functions

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Lắng nghe thông báo từ Firebase
    useEffect(() => {
        const notificationsRef = ref(database, 'notifications');
        const unsubscribe = onValue(notificationsRef, (snapshot) => {
            const data = snapshot.val();
            const formattedNotifications = data ? Object.values(data) : [];
            setNotifications(formattedNotifications);
        });

        return () => unsubscribe(); // Dọn dẹp lắng nghe khi component unmount
    }, []);

    // Thêm thông báo vào Firebase
    const addNotification = (message) => {
        const notificationsRef = ref(database, 'notifications');
        push(notificationsRef, { message, isRead: false }); // Mặc định thông báo là chưa đọc
    };

    // Xóa toàn bộ thông báo trong Firebase
    const clearNotifications = () => {
        const notificationsRef = ref(database, 'notifications');
        remove(notificationsRef);
    };

    // Đánh dấu tất cả thông báo là đã đọc
    const markAllRead = () => {
        const notificationsRef = ref(database, 'notifications');
        
        // Create a new array of notifications with isRead set to true
        const updatedNotifications = notifications.map(notification => ({
            ...notification,
            isRead: true
        }));
    
        // Replace the entire notifications array
        set(notificationsRef, updatedNotifications);
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
