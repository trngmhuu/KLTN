import React, { useState } from 'react';
import { Button, Table, message, Typography, Input } from 'antd';

const { Title } = Typography;

function SearchCustomerSta() {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [emailFilter, setEmailFilter] = useState('');

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    // Gọi API để lấy thống kê khách hàng
    const fetchCustomerStatistics = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://tourwebbe.onrender.com/bookings/customer-statistics', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Lỗi khi gọi API');
            }

            const data = await response.json();
            setStatistics(data);
            message.success('Lấy thông tin thống kê thành công!');
        } catch (error) {
            console.error('Lỗi khi lấy thông tin thống kê:', error);
            message.error('Có lỗi xảy ra khi lấy thông tin thống kê.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý tìm kiếm theo email
    const handleSearchEmail = (e) => {
        setEmailFilter(e.target.value);
    };

    // Cấu hình cột cho bảng hiển thị
    const columns = [
        { title: 'Email Khách Hàng', dataIndex: 'customerEmail', key: 'customerEmail' },
        { title: 'Tên Khách Hàng', dataIndex: 'customerName', key: 'customerName' },  // Cột tên khách hàng
        { title: 'Tổng Doanh Thu', dataIndex: 'totalSpent', key: 'totalSpent', render: (text) => text.toLocaleString() + ' VND' },
    ];

    // Lọc thống kê theo email nếu có giá trị tìm kiếm
    const filteredStatistics = statistics.filter((stat) => {
        return stat.customerEmail.toLowerCase().includes(emailFilter.toLowerCase());
    });

    return (
        <div>
            <Title level={2}>Thống Kê Chi Tiền Của Khách Hàng</Title>

            <Button type="primary" onClick={fetchCustomerStatistics} loading={loading} style={{ marginBottom: '10px', marginRight: "10px" }}>
                Tải Thống Kê
            </Button>

            {/* Ô tìm kiếm email khách hàng */}
            <Input
                placeholder="Tìm kiếm theo email khách hàng"
                value={emailFilter}
                onChange={handleSearchEmail}
                style={{ marginBottom: '20px', width: '300px' }}
            />

            <Table
                dataSource={filteredStatistics}
                columns={columns}
                rowKey="customerEmail"
                style={{ marginTop: '20px' }}
            />
        </div>
    );
}

export default SearchCustomerSta;
