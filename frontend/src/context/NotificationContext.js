import React, { createContext, useState, useContext, useEffect } from 'react';
import { database } from '../firebase/FirebaseConfig';
import { ref, push, onValue, update, remove } from 'firebase/database';

const NotificationContext = createContext();

const sanitizeEmail = (email) => email.replace(/\./g, ',');

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [notificationStatus, setNotificationStatus] = useState({});
    const userEmail = JSON.parse(localStorage.getItem('userInfo'))?.email;
    const sanitizedEmail = userEmail ? sanitizeEmail(userEmail) : null;

    useEffect(() => {
        // Lấy thông báo chung
        const globalNotificationsRef = ref(database, 'notifications/global');
        const globalListener = onValue(globalNotificationsRef, (snapshot) => {
            const data = snapshot.val();
            const formattedNotifications = data ? Object.entries(data).map(([id, notification]) => ({
                id,
                ...notification
            })) : [];
            setNotifications(formattedNotifications);
        });

        // Lấy trạng thái thông báo của người dùng
        if (sanitizedEmail) {
            const userStatusRef = ref(database, `notificationsStatus/${sanitizedEmail}`);
            const statusListener = onValue(userStatusRef, (snapshot) => {
                const data = snapshot.val();
                setNotificationStatus(data || {});
            });

            return () => {
                globalListener();
                statusListener();
            };
        }

        return () => globalListener();
    }, [sanitizedEmail]);

    // Thêm thông báo mới (toàn bộ người dùng)
    const addNotification = (message) => {
        const globalNotificationsRef = ref(database, 'notifications/global');
        push(globalNotificationsRef, { message, timestamp: Date.now() });
    };

    // Đánh dấu tất cả thông báo là đã đọc cho người dùng hiện tại
    const markAllRead = () => {
        if (!sanitizedEmail) return;

        const updates = {};
        notifications.forEach((notification) => {
            updates[notification.id] = true; // Đánh dấu đã đọc
        });

        const userStatusRef = ref(database, `notificationsStatus/${sanitizedEmail}`);
        update(userStatusRef, updates);
    };

    // Kiểm tra trạng thái đã đọc của từng thông báo
    const isRead = (notificationId) => notificationStatus[notificationId] || false;

    // Tính số lượng thông báo chưa đọc
    const unreadCount = notifications.filter(notification => !isRead(notification.id)).length;

    // Clear all notifications for admin
    const clearNotifications = () => {
        const globalNotificationsRef = ref(database, 'notifications/global');
        remove(globalNotificationsRef)
            .then(() => {
                console.log('All notifications have been cleared by the Admin.');
            })
            .catch((error) => {
                console.error('Failed to clear notifications:', error);
            });
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                markAllRead,
                isRead,
                unreadCount,
                clearNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
