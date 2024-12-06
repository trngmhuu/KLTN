import React, { useState, useEffect } from 'react';
import './dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState({
        totalTours: 0,
        totalCustomers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        lastYearRevenue: 0,
        growthRate: null,
    });

    // Giả sử token được lưu trong localStorage hoặc state khác
    const token = localStorage.getItem('token'); // Hoặc thay bằng cách lấy token khác

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Thêm token vào header
                };

                // Gọi API lấy số lượng khách hàng
                const customerRes = await fetch('https://tourwebbe.onrender.com/customers/count', { headers });
                const customerData = await customerRes.json();

                // Gọi API lấy số lượng tour
                const tourRes = await fetch('https://tourwebbe.onrender.com/tours/count-active', { headers });
                const tourData = await tourRes.json();

                // Gọi API lấy số lượng đơn đặt tour
                const bookingRes = await fetch('https://tourwebbe.onrender.com/bookings/count-completed', { headers });
                const bookingData = await bookingRes.json();

                // Lấy năm hiện tại và năm trước
                const currentYear = new Date().getFullYear();
                const lastYear = currentYear - 1;

                // Gọi API lấy tổng doanh thu năm nay
                const revenueRes = await fetch(`https://tourwebbe.onrender.com/bookings/revenue?year=${currentYear}`, { headers });
                const revenueData = await revenueRes.json();

                // Gọi API lấy tổng doanh thu năm ngoái
                const lastYearRevenueRes = await fetch(`https://tourwebbe.onrender.com/bookings/revenue?year=${lastYear}`, { headers });
                const lastYearRevenueData = await lastYearRevenueRes.json();

                console.log('Dữ liệu thống kê:', customerData, tourData, bookingData, revenueData, lastYearRevenueData);

                // Tính tỷ lệ tăng trưởng
                const growthRate = lastYearRevenueData ? ((revenueData - lastYearRevenueData) / lastYearRevenueData * 100).toFixed(2) : null;

                setStats({
                    totalTours: tourData,
                    totalCustomers: customerData,
                    totalBookings: bookingData,
                    totalRevenue: revenueData,
                    lastYearRevenue: lastYearRevenueData,
                    growthRate: growthRate,
                });
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu thống kê:', error);
            }
        };

        fetchStats();
    }, [token]); // Thêm token vào dependency array
return (
        <section className="dashboard section">
            <p>Chào mừng bạn đến với trang quản trị!</p>

            <div className="stats-container">
                <div className="stat-box">
                    <h4>Tour đang hoạt động</h4>
                    <p>{stats.totalTours}</p>
                </div>
                <div className="stat-box">
                    <h4>Số lượng khách hàng</h4>
                    <p>{stats.totalCustomers}</p>
                </div>
                <div className="stat-box">
                    <h4>Số lượng đơn đặt tour</h4>
                    <p>{stats.totalBookings}</p>
                </div>
                <div className="stat-box">
                    <h4>Tổng doanh thu {new Date().getFullYear()}</h4>
                    <p>
                        {stats.totalRevenue && new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
                    </p>
                </div>

                {/* Hiển thị tỷ lệ tăng trưởng hoặc giảm */}
                <div className="stat-box">
                    <h4>Tỷ lệ tăng trưởng doanh thu</h4>
                    <p style={{ color: stats.growthRate !== null ? (stats.growthRate > 0 ? 'green' : (stats.growthRate < 0 ? 'red' : 'black')) : 'black' }}>
                        {stats.growthRate !== null
                            ? (stats.growthRate > 0 ? `+${stats.growthRate}%` : `${stats.growthRate}%`)
                            : 'Chưa có dữ liệu '}
                    </p>
                </div>

            </div>
        </section>
    );
}

export default Dashboard;