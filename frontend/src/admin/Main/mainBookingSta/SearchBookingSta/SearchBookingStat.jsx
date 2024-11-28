import React, { useState } from 'react';
import { DatePicker, Button, Table, message, Typography } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

function SearchBookingStat() {
    const [dates, setDates] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [totalBookings, setTotalBookings] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0); // Thêm state cho tổng doanh thu
    const [loading, setLoading] = useState(false);

    // Xử lý sự kiện chọn ngày
    const onDateChange = (dates) => {
        setDates(dates);
    };

    // Lấy token từ localStorage (hoặc từ nơi bạn lưu trữ)
    const token = localStorage.getItem('token');

    // Gọi API để tìm kiếm booking theo ngày
    const fetchBookings = async () => {
        if (!dates || dates.length < 2) {
            message.error('Vui lòng chọn khoảng ngày hợp lệ.');
            return;
        }

        const startDate = dates[0].format('DD/MM/YYYY');
        const endDate = dates[1].format('DD/MM/YYYY');

        try {
            setLoading(true);
            console.log('startDate:', startDate);
            console.log('endDate:', endDate);
            // Thêm token vào header của request
            const response = await fetch(`http://localhost:8080/bookings/filter?startDate=${startDate}&endDate=${endDate}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Thêm token vào header
                }
            });

            if (!response.ok) {
                throw new Error('Lỗi khi gọi API');
            }

            const data = await response.json();
            setBookings(data);
            setTotalBookings(data.length); // Cập nhật tổng số bookings

            // Tính tổng doanh thu
            const total = data.reduce((acc, booking) => acc + booking.totalMoney, 0);
            setTotalRevenue(total); // Cập nhật tổng doanh thu

            message.success('Tìm kiếm thành công!');
        } catch (error) {
            console.error('Lỗi khi tìm kiếm bookings:', error);
            message.error('Có lỗi xảy ra khi tìm kiếm bookings.');
        } finally {
            setLoading(false);
        }
    };

    // Cấu hình cột cho bảng hiển thị
    const columns = [
        { title: 'Mã Booking', dataIndex: 'bookingCode', key: 'bookingCode' },
        { title: 'Tên Khách Hàng', dataIndex: 'customerName', key: 'customerName' },
        { title: 'Ngày Đặt', dataIndex: 'bookingDate', key: 'bookingDate' },
        { title: 'Trạng Thái', dataIndex: 'activeBooking', key: 'activeBooking' },
        { title: 'Số Tiền', dataIndex: 'totalMoney', key: 'totalMoney', render: (text) => text.toLocaleString() + ' VND' },  // Hiển thị số tiền với định dạng VND
    ];

    return (
        <div>
            <Title level={2}>Tìm Kiếm Booking Theo Ngày</Title>

            <RangePicker format="DD/MM/YYYY" onChange={onDateChange} />
            <Button type="primary" onClick={fetchBookings} style={{ marginLeft: '10px' }} loading={loading}>
                Tìm Kiếm
            </Button>

            {/* Hiển thị tổng số bookings */}
            <div style={{ marginTop: '20px', fontSize: '16px' }}>
                <strong>Tổng số bookings: </strong>{totalBookings}
            </div>

            <Table
                dataSource={bookings}
                columns={columns}
                rowKey="id"
                style={{ marginTop: '20px' }}
            />

            {/* Hiển thị tổng doanh thu */}
            <div style={{ marginTop: '20px', fontSize: '16px' }}>
                <strong>Tổng doanh thu: </strong>{totalRevenue.toLocaleString()} VND
            </div>
        </div>
    );
}

export default SearchBookingStat;
