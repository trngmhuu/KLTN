import { Tag, Button, Form, Input, Table, Modal, message, Popover, Calendar } from 'antd';
import React, { useState, useEffect } from 'react';
import './approve-tour.css';
import './transition.css';
import { DeleteFilled, ExclamationCircleOutlined, EyeOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import moment from 'moment/moment';
import { Container, Row, Col } from "reactstrap";
const { confirm } = Modal;

const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
};

function ApproveTour({ changeComponent }) {
    const [searchParams, setSearchParams] = useState({
        name: '',
        tourCode: '',
    });

    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // Thêm biến để kiểm soát chế độ chỉnh sửa
    const [newTour, setNewTour] = useState({
        tourCode: '',
        name: '',
        description: '',
        image: null,
        typeTourId: '',
        typeId: '',
        locationStart: '',
        startDay: [],
        durationTour: '',
        price: '',
        vehicle: '',
        isActive: true,
        saleTour: false,
        percentSale: ""
    });

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8080/tours', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (Array.isArray(result.result)) {
                // Lọc các tour có isActive = false
                const filteredTours = result.result.filter(tour => !tour.isActive);
                setData(filteredTours); // Cập nhật danh sách với các tour có isActive = false
            } else {
                throw new Error('Expected result to be an array');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Không thể tải dữ liệu từ API.');
        }
    };

    // New function for fetching inactive tours based on search parameters
    const fetchInactiveTours = async () => {
        const { name, tourCode } = searchParams; // Extract search parameters

        try {
            // Construct the query parameters
            const token = localStorage.getItem('token');

            const queryParams = new URLSearchParams({
                ...(name && { name }),
                ...(tourCode && { tourCode }),
                limit: 100,  // Adjust as needed
            }).toString();

            const response = await fetch(`http://localhost:8080/tours/searchTourAdminFalse?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (Array.isArray(result.result)) {
                setData(result.result); // Update the state with the filtered tours
            } else {
                throw new Error('Expected result to be an array');
            }
        } catch (error) {
            console.error('Error fetching inactive tours:', error);
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
            name: '',
            tourCode: '',
        });
    };

    const handleReload = () => {
        fetchData();
    };


    const handleEdit = (record) => {
        changeComponent('update', record.tourCode); // Truyền toàn bộ record để sử dụng trong UpdateTourForm
    };

    // const handleDelete = async (tourCode) => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await fetch(`http://localhost:8080/tours/${tourCode}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    //         if (response.ok) {
    //             fetchData(); // Cập nhật lại danh sách sau khi xóa thành công
    //             message.success('Tour đã được xóa thành công'); // Thông báo thành công
    //         } else {
    //             throw new Error('Bạn không có quyền thực hiện điều này');
    //         }
    //     } catch (error) {
    //         console.error('Error deleting tour:', error);
    //     }
    // };

    // const showDeleteConfirm = (tourCode) => {
    //     confirm({
    //         title: 'Bạn có chắc chắn muốn xóa Tour này?',
    //         icon: <ExclamationCircleOutlined />,
    //         content: `Mã tour: ${tourCode}`,
    //         okText: 'Xóa',
    //         okType: 'danger',
    //         cancelText: 'Hủy',
    //         onOk() {
    //             handleDelete(tourCode);
    //         },
    //         onCancel() {
    //             console.log('Hủy hành động xóa');
    //         },
    //     });
    // };

    const columns = [
        {
            title: 'Mã',
            dataIndex: 'tourCode',
            key: 'tourCode',
            width: 85
        },
        {
            title: 'Tên Tour',
            dataIndex: 'name',
            key: 'name',
            width: 125
        },
        {
            title: "Phương tiện",
            dataIndex: "vehicle",
            key: "vehicle",
            width: 111
        },
        {
            title: "Thời gian đi",
            dataIndex: "durationTour",
            key: "durationTour",
        },
        // {
        //     title: "Ngày khởi hành",
        //     dataIndex: "startDay",
        //     key: "startDay",
        // },
        // {
        //     title: "Điểm khởi hành",
        //     dataIndex: "locationStart",
        //     key: "locationStart",
        // },
        {
            title: 'Giá gốc (VNĐ)',
            dataIndex: "price",
            key: 'price',
            render: (price) => (
                formatPrice(price)
            ),
            width: 100
        },
        {
            title: 'Giảm giá',
            key: 'saleTour',
            render: (_, { saleTour, percentSale }) => (
                saleTour ? (
                    <Tag color='green'>{`Giảm ${percentSale}%`}</Tag>
                ) : (
                    <Tag color='volcano'>Không giảm giá</Tag>
                )
            ),
        },
        {
            title: 'Giá sau khi giảm (VNĐ)',
            key: 'discountedPrice',
            render: (_, { price, percentSale, saleTour }) => {
                const discountedPrice = saleTour && percentSale ? price * (1 - percentSale / 100) : price;
                return <span>{formatPrice(discountedPrice)}</span>;
            },
            width: 100
        },
        {
            title: 'Trạng thái',
            key: 'isActive',
            render: (_, { isActive }) => (
                <Tag color={isActive ? 'green' : 'volcano'}>
                    {isActive ? 'Đang nhận khách' : 'Chưa cho phép đặt'}
                </Tag>
            ),
            width: 90
        },
        {
            title: 'Hình đại diện',
            dataIndex: 'image',
            key: 'image',
            render: (text) => (
                <img
                    src={text}
                    alt="Tour"
                    style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 8 }}
                />
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <div className="action-buttons">
                    <Button type="link" onClick={() => handleEdit(record)}><EyeOutlined /></Button>
                    {/* <Button type="link" danger onClick={() => showDeleteConfirm(record.tourCode)}><DeleteFilled /></Button> */}
                </div>
            ),
        }
    ];

    return (
        <div>
            <ul className='searchtable-container'>
                <li className='search-container'>
                    <h6>Tìm kiếm Tour</h6>
                    <Form className="custom-inline-form-tour" layout="inline">
                        <Form.Item>
                            <Input
                                name="name"
                                placeholder="Tên Tour"
                                value={searchParams.name}
                                onChange={handleInputChange}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                name="tourCode"
                                placeholder="Mã Tour"
                                value={searchParams.tourCode}
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
                            <Button type="primary" onClick={fetchInactiveTours}>
                                Tìm kiếm
                            </Button>
                        </Form.Item>
                    </Form>
                </li>
            </ul>
            {/* Header của bảng */}
            <div className='table-header'>
                <h6>Danh sách các tour chưa xét duyệt</h6>
                <div className='table-header-actions'>
                    <Button onClick={handleReload}>
                        <ReloadOutlined />
                    </Button>
                </div>
            </div>

            {/* Bảng dữ liệu với pagination */}
            <TransitionGroup>
                <CSSTransition
                    key="searchTable"
                    timeout={300}
                    classNames="fade"
                >
                    {/* Nội dung chính của bạn ở đây, ví dụ: bảng */}
                    <div className='table-container'>
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey="tourId"
                            pagination={{
                                pageSize: 5,
                                // showSizeChanger: true,
                                // pageSizeOptions: ['3', '5', '10'],
                            }}
                        />
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}

export default ApproveTour;