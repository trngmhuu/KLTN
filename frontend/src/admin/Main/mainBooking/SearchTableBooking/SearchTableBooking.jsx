import { Tag, Button, Form, Input, Table, Modal, message } from 'antd';
import React, { useState, useEffect } from 'react';
import './searchTableBooking.css';
import './transition.css';
import { DeleteFilled, ExclamationCircleOutlined, EyeOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const { confirm } = Modal;

const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

function SearchTableBooking({ changeComponent }) {
    const [searchParams, setSearchParams] = useState({
        customerName: '',
        bookingCode: '',
    });

    const [data, setData] = useState([]);
    // const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/bookings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Data:', result);

            if (Array.isArray(result.result)) {
                setData(result.result); // Cập nhật với danh sách bookings từ `result`
            } else {
                throw new Error('Expected result to be an array');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Không thể tải dữ liệu từ API.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({
            ...searchParams,
            [name]: value,
        });
    };

    const handleReset = () => {
        setSearchParams({
            customerName: '',
            bookingCode: '',
        });
    };

    const handleReload = () => {
        fetchData();
    };

    const handleEdit = (record) => {
        // Kiểm tra nếu booking đã thanh toán
        if (record.payBooking) {
            // Nếu đã thanh toán, hiển thị thông báo lỗi và không cho phép cập nhật
            message.error('Đặt chỗ này đã thanh toán, không thể cập nhật!');
            return; // Không làm gì thêm, không mở form cập nhật
        }

        // Nếu chưa thanh toán, tiến hành mở form cập nhật
        changeComponent('update', record.bookingCode); // Gọi hàm changeComponent với mã booking
    };


    const handleDelete = async (bookingCode) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/bookings/${bookingCode}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                fetchData(); // Cập nhật lại danh sách sau khi xóa thành công
                message.success('Đặt chỗ đã được xóa thành công'); // Thông báo thành công
            } else {
                throw new Error('Failed to delete booking');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const showDeleteConfirm = (bookingCode) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa Đặt Chỗ này?',
            icon: <ExclamationCircleOutlined />,
            content: `Mã đặt chỗ: ${bookingCode}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDelete(bookingCode);
            },
            onCancel() {
                console.log('Hủy hành động xóa');
            },
        });
    };

    const columns = [
        {
            title: 'Mã Đặt Chỗ',
            dataIndex: 'bookingCode',
            key: 'bookingCode',
        },
        {
            title: 'Tên Khách Hàng',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Email Khách Hàng',
            dataIndex: 'customerEmail',
            key: 'customerEmail',
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'customerPhoneNumber',
            key: 'customerPhoneNumber',
        },
        {
            title: 'Ngày Đặt',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
        },
        {
            title: "Số người đi",
            dataIndex: "numberOfCustomer",
            key: "numberOfCustomer"
        },
        {
            title: 'Ngày Dự Kiến',
            dataIndex: 'expectedDate',
            key: 'expectedDate',
        },
        {
            title: 'Tổng Tiền (VNĐ)',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
            render: (totalMoney) => (
                formatPrice(totalMoney)
            )
        },
        {
            title: 'Thanh Toán',
            key: 'payBooking',
            render: (_, { payBooking }) => (
                <Tag color={payBooking ? 'green' : 'volcano'}>
                    {payBooking ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
                </Tag>
            ),
        },
        // {
        //     title: 'Trạng Thái',
        //     key: 'activeBooking',
        //     render: (_, { activeBooking }) => (
        //         <Tag color={activeBooking ? 'green' : 'volcano'}>
        //             {activeBooking ? 'Xác nhận' : 'Hủy booking'}
        //         </Tag>
        //     ),
        // },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <div className="action-buttons">
                    <Button type="link" onClick={() => handleEdit(record)}><EyeOutlined /></Button>
                    <Button type="link" danger onClick={() => showDeleteConfirm(record.bookingCode)}><DeleteFilled /></Button>
                </div>
            ),
        }
    ];

    return (
        <div>
            <ul className='searchtable-container'>
                <li className='search-container'>
                    <h6>Tìm kiếm Đặt Chỗ</h6>
                    <Form className="custom-inline-form-booking" layout="inline">
                        <Form.Item>
                            <Input
                                name="customerName"
                                placeholder="Tên Khách Hàng"
                                value={searchParams.customerName}
                                onChange={handleInputChange}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                name="bookingCode"
                                placeholder="Mã Đặt Chỗ"
                                value={searchParams.bookingCode}
                                onChange={handleInputChange}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleReset}>
                                Xóa Trắng
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary">
                                Tìm kiếm
                            </Button>
                        </Form.Item>
                    </Form>
                </li>
            </ul>
            <div className='table-header'>
                <h6>Bảng Dữ Liệu Đặt Chỗ</h6>
                <div className='table-header-actions'>
                    <Button
                        type="primary"
                        onClick={() => changeComponent('add')} // Chuyển sang form thêm Đặt Chỗ
                    >
                        <PlusCircleOutlined />
                    </Button>
                    <Button onClick={handleReload}>
                        <ReloadOutlined />
                    </Button>
                </div>
            </div>

            <TransitionGroup>
                <CSSTransition
                    key="searchTable"
                    timeout={300}
                    classNames="fade"
                >
                    <div className='table-container'>
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey="bookingCode"
                            pagination={{
                                pageSize: 3,
                                showSizeChanger: true,
                                pageSizeOptions: ['3', '5', '10'],
                            }}
                        />
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}

export default SearchTableBooking;
