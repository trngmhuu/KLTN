import React, { useEffect, useState, useRef, useCallback } from "react";
import "./header.css";
import Logo from "./logo/Logo";
import Nav from "./nav/Nav";
import { useNotifications } from "../../context/NotificationContext";

function Header() {
  const {
    notifications,
    clearNotifications,
    markAllRead,
    unreadCount,
    isRead,
    addNotification: originalAddNotification,
  } = useNotifications();

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Lưu quyền người dùng từ localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo?.roles.includes("ADMIN");

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const markAllAsRead = () => {
    markAllRead();
  };

  // Định dạng thời gian
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Hàm tính số ngày còn lại giữa ngày expectedDate và hiện tại
  const calculateDaysRemaining = (expectedDate) => {
    const currentDate = new Date();
    const targetDate = new Date(expectedDate.split("/").reverse().join("/")); // Chuyển định dạng dd/MM/yyyy sang yyyy-MM-dd
    const diffTime = targetDate - currentDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Sử dụng useRef để tránh trigger re-render
  const notifiedBookingsRef = useRef(new Set()); // Lưu các booking đã thông báo

  // Đảm bảo addNotification không bị thay đổi
  const addNotification = useCallback(
    (message) => {
      originalAddNotification(message);
    },
    [originalAddNotification]
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("https://tourwebbe.onrender.com/bookings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const bookings = data.result;

          bookings.forEach((booking) => {
            const daysRemaining = calculateDaysRemaining(booking.expectedDate);

            // Chỉ thêm thông báo nếu chưa có trong notifiedBookingsRef
            if (
              daysRemaining > 0 &&
              daysRemaining <= 5 &&
              !booking.payBooking &&
              !notifiedBookingsRef.current.has(booking.bookingCode) &&
              booking.activeBooking === "Hoạt động"
            ) {
              console.log(
                `Thêm thông báo cho bookingCode: ${booking.bookingCode}`
              );

              addNotification(
                `Đơn đặt tour có mã ${booking.bookingCode} còn ${daysRemaining} ngày tới ngày đi nhưng vẫn chưa thanh toán`
              );

              // Thêm bookingCode vào Set mà không trigger re-render
              notifiedBookingsRef.current.add(booking.bookingCode);
            }
          });
        } else {
          console.error("Lỗi khi gọi API:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi khi kết nối tới API:", error);
      }
    };

    fetchBookings();
  }, [addNotification]); // Chỉ chạy lại khi addNotification thay đổi

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <Logo />
      <div className="header__section d-flex">
        <span className="bell" onClick={toggleDropdown}>
          <i className="ri-notification-line"></i>
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount}</span>
          )}
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
                  notifications
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((notification, index) => (
                      <div
                        key={index}
                        className={`notification-item ${
                          isRead(notification.id) ? "read" : "unread"
                        }`}
                      >
                        <div>{notification.message}</div>
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