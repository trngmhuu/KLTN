import { Tag, Button, Form, Input, Select, Table, Modal, message } from 'antd';
import React, { useState, useEffect } from 'react';
import './searchTableTourType.css';
import { DeleteFilled, ExclamationCircleOutlined, EyeOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;

function SearchTableTourType() {
    const [searchParams, setSearchParams] = useState({ name: '' });
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newTypeTour, setNewTypeTour] = useState({ name: '', typeId: '' });

    // State để lưu loại tour đang được xem chi tiết
    const [selectedTour, setSelectedTour] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/typetours', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            setData(result.result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    };

    const handleReset = () => setSearchParams({ name: '' });
    const handleReload = () => fetchData();
    const handleAdd = () => setIsModalVisible(true);

    const handleEdit = (record) => {
        setSelectedTour(record);
        setIsDetailModalVisible(true);
    };

    const handleDetailModalClose = () => {
        setIsDetailModalVisible(false);
        setSelectedTour(null);
    };

    const handleDelete = async (typeTourId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/typetours/${typeTourId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                message.success('Đã xóa thành công!');
                fetchData();
            } else throw new Error('Failed to delete type tour');
        } catch (error) {
            console.error('Error deleting type tour:', error);
            message.error('Có lỗi xảy ra khi xóa!');
        }
    };

    const showDeleteConfirm = (typeTourId) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa danh mục này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDelete(typeTourId);
            },
        });
    };

    const handleNewTypeTourChange = (name, value) => {
        setNewTypeTour({ ...newTypeTour, [name]: value });
    };

    const handleSaveNewTypeTour = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/typetours', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newTypeTour),
            });

            if (response.ok) {
                message.success('Loại tour đã được thêm thành công!');
                setIsModalVisible(false);
                fetchData();
                setNewTypeTour({ name: '', typeId: '' });
            } else throw new Error('Failed to add type tour');
        } catch (error) {
            console.error('Error adding type tour:', error);
            message.error('Kiểm tra dữ liệu thêm mới đã bị trùng!');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'typeTourId', key: 'typeTourId' },
        { title: 'Tên phân loại', dataIndex: 'name', key: 'name' },
        {
            title: 'Loại tour',
            dataIndex: 'typeId',
            key: 'typeId',
            render: (typeId) => (
                <Tag color={typeId === '1' ? 'blue' : 'green'}>
                    {typeId === '1' ? 'Tour trong nước' : 'Tour ngoài nước'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <div className="action-buttons">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        <EyeOutlined />
                    </Button>
                    <Button type="link" danger onClick={() => showDeleteConfirm(record.typeTourId)}>
                        <DeleteFilled />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <ul className='searchtable-container'>
                <li className='search-container'>
                    <h6>Tìm kiếm phân loại</h6>
                    <Form className="custom-inline-form-typetour" layout="inline">
                        <Form.Item>
                            <Input
                                name="name"
                                placeholder="Tên phân loại"
                                value={searchParams.name}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleReset}>Xóa Trắng</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary">Tìm kiếm</Button>
                        </Form.Item>
                    </Form>
                </li>
            </ul>

            <div className='table-header'>
                <h6>Danh sách phân loại</h6>
                <div className='table-header-actions'>
                    <Button type="primary" onClick={handleAdd}>
                        <PlusCircleOutlined />
                    </Button>
                    <Button onClick={handleReload}>
                        <ReloadOutlined />
                    </Button>
                </div>
            </div>

            <div className='table-container'>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="typeTourId"
                    pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
                />
            </div>


            {/* Add New Tour Type Modal */}
            <Modal
                title="Thêm Loại Tour"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSaveNewTypeTour}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên phân loại">
                        <Input
                            value={newTypeTour.name}
                            onChange={(e) => handleNewTypeTourChange('name', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Loại tour">
                        <Select
                            value={newTypeTour.typeId}
                            onChange={(value) => handleNewTypeTourChange('typeId', value)}
                        >
                            <Option value="1">Tour trong nước</Option>
                            <Option value="2">Tour ngoài nước</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Chi Tiết Loại Tour"
                visible={isDetailModalVisible}
                onCancel={handleDetailModalClose}
                footer={[
                    <Button key="close" onClick={handleDetailModalClose}>Đóng</Button>,
                ]}
            >
                {selectedTour && (
                    <div>
                        <p><strong>ID:</strong> {selectedTour.typeTourId}</p>
                        <p><strong>Tên phân loại:</strong> {selectedTour.name}</p>
                        <p><strong>Loại Tour:</strong>
                            {selectedTour.typeId === '1' ? 'Tour trong nước' : 'Tour ngoài nước'}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default SearchTableTourType;
