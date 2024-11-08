import { Tag, Button, Form, Input, Select, Table, Modal, message, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import './searchTableCustomer.css';
import { DeleteFilled, ExclamationCircleOutlined, EyeOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;

function SearchTableCustomer() {
    const [searchParams, setSearchParams] = useState({
        customerName: '',
        customerEmail: '',
        customerPhoneNumber: ''
    });
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        customerName: '',
        customerEmail: '',
        customerPhoneNumber: '',
        customerType: '',
        customerCity: '',
        customerDistrict: '',
        customerAddress: '',
        customerDateOfBirth: null,  // Add Date of Birth field
    });
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/customers', {
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

    const handleReset = () => setSearchParams({ customerName: '', customerEmail: '', customerPhoneNumber: '' });
    const handleReload = () => fetchData();
    const handleAdd = () => setIsModalVisible(true);

    const handleEdit = (record) => {
        setSelectedCustomer(record);
        setIsDetailModalVisible(true);
    };

    const handleDetailModalClose = () => {
        setIsDetailModalVisible(false);
        setSelectedCustomer(null);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/customers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                message.success('Đã xóa khách hàng thành công!');
                fetchData();
            } else throw new Error('Failed to delete customer');
        } catch (error) {
            console.error('Error deleting customer:', error);
            message.error('Có lỗi xảy ra khi xóa!');
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa khách hàng này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDelete(id);
            },
        });
    };

    const handleNewCustomerChange = (name, value) => {
        setNewCustomer({ ...newCustomer, [name]: value });
    };

    const handleSaveNewCustomer = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newCustomer),
            });

            if (response.ok) {
                message.success('Khách hàng đã được thêm thành công!');
                setIsModalVisible(false);
                fetchData();
                setNewCustomer({
                    customerName: '',
                    customerEmail: '',
                    customerPhoneNumber: '',
                    customerType: '',
                    customerCity: '',
                    customerDistrict: '',
                    customerAddress: '',
                    customerDateOfBirth: null,  // Reset Date of Birth
                });
            } else throw new Error('Failed to add customer');
        } catch (error) {
            console.error('Error adding customer:', error);
            message.error('Kiểm tra dữ liệu thêm mới!');
        }
    };

    const handleUpdateCustomer = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/customers/${selectedCustomer.idAsString}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(selectedCustomer),
            });

            if (response.ok) {
                message.success('Khách hàng đã được cập nhật thành công!');
                fetchData();
                handleDetailModalClose();
            } else throw new Error('Failed to update customer');
        } catch (error) {
            console.error('Error updating customer:', error);
            message.error('Có lỗi xảy ra khi cập nhật!');
        }
    };

    const columns = [
        { title: 'Tên khách hàng', dataIndex: 'customerName', key: 'customerName' },
        { title: 'Email', dataIndex: 'customerEmail', key: 'customerEmail' },
        { title: 'Số điện thoại', dataIndex: 'customerPhoneNumber', key: 'customerPhoneNumber' },
        // { title: 'Ngày sinh', dataIndex: 'customerDateOfBirth', key: 'customerDateOfBirth', render: (text) => text ? new Date(text).toLocaleDateString() : '' },  // Render date
        // { title: 'Loại khách hàng', dataIndex: 'customerType', key: 'customerType' },
        { title: 'Thành phố', dataIndex: 'customerCity', key: 'customerCity' },
        { title: 'Quận', dataIndex: 'customerDistrict', key: 'customerDistrict' },
        { title: 'Địa chỉ', dataIndex: 'customerAddress', key: 'customerAddress' },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <div className="action-buttons">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        <EyeOutlined />
                    </Button>
                    <Button type="link" danger onClick={() => showDeleteConfirm(record.idAsString)}>
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
                    <h6>Tìm kiếm khách hàng</h6>
                    <Form className="custom-inline-form-customer" layout="inline">
                        <Form.Item>
                            <Input
                                name="customerName"
                                placeholder="Tên khách hàng"
                                value={searchParams.customerName}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                name="customerEmail"
                                placeholder="Email khách hàng"
                                value={searchParams.customerEmail}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                name="customerPhoneNumber"
                                placeholder="Số điện thoại khách hàng"
                                value={searchParams.customerPhoneNumber}
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
                <h6>Danh sách khách hàng</h6>
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
                    rowKey="id"
                    pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
                />
            </div>

            {/* Add New Customer Modal */}
            <Modal
                title="Thêm Khách Hàng"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSaveNewCustomer}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên khách hàng">
                        <Input
                            value={newCustomer.customerName}
                            onChange={(e) => handleNewCustomerChange('customerName', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input
                            value={newCustomer.customerEmail}
                            onChange={(e) => handleNewCustomerChange('customerEmail', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Số điện thoại">
                        <Input
                            value={newCustomer.customerPhoneNumber}
                            onChange={(e) => handleNewCustomerChange('customerPhoneNumber', e.target.value)}
                        />
                    </Form.Item>
                    {/* <Form.Item label="Ngày sinh">
                        <DatePicker
                            value={newCustomer.customerDateOfBirth}
                            onChange={(date) => handleNewCustomerChange('customerDateOfBirth', date)}
                        />
                    </Form.Item>
                    <Form.Item label="Loại khách hàng">
                        <Select
                            value={newCustomer.customerType}
                            onChange={(value) => handleNewCustomerChange('customerType', value)}
                        >
                            <Option value="regular">Thường</Option>
                            <Option value="premium">Cao cấp</Option>
                        </Select>
                    </Form.Item> */}
                    <Form.Item label="Thành phố">
                        <Input
                            value={newCustomer.customerCity}
                            onChange={(e) => handleNewCustomerChange('customerCity', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Quận">
                        <Input
                            value={newCustomer.customerDistrict}
                            onChange={(e) => handleNewCustomerChange('customerDistrict', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Địa chỉ">
                        <Input
                            value={newCustomer.customerAddress}
                            onChange={(e) => handleNewCustomerChange('customerAddress', e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Customer Detail Modal */}
            <Modal
                title="Chỉnh sửa khách hàng"
                visible={isDetailModalVisible}
                onCancel={handleDetailModalClose}
                onOk={handleUpdateCustomer}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên khách hàng">
                        <Input
                            value={selectedCustomer?.customerName}
                            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, customerName: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input
                            value={selectedCustomer?.customerEmail}
                            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, customerEmail: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Số điện thoại">
                        <Input
                            value={selectedCustomer?.customerPhoneNumber}
                            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, customerPhoneNumber: e.target.value })}
                        />
                    </Form.Item>
                    {/* <Form.Item label="Ngày sinh">
                        <DatePicker
                            value={selectedCustomer?.customerDateOfBirth}
                            onChange={(date) => setSelectedCustomer({ ...selectedCustomer, customerDateOfBirth: date })}
                        />
                    </Form.Item>
                    <Form.Item label="Loại khách hàng">
                        <Select
                            value={selectedCustomer?.customerType}
                            onChange={(value) => setSelectedCustomer({ ...selectedCustomer, customerType: value })}
                        >
                            <Option value="regular">Thường</Option>
                            <Option value="premium">Cao cấp</Option>
                        </Select>
                    </Form.Item> */}
                    <Form.Item label="Thành phố">
                        <Input
                            value={selectedCustomer?.customerCity}
                            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, customerCity: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Quận">
                        <Input
                            value={selectedCustomer?.customerDistrict}
                            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, customerDistrict: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Địa chỉ">
                        <Input
                            value={selectedCustomer?.customerAddress}
                            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, customerAddress: e.target.value })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default SearchTableCustomer;
