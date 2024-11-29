import { Tag, Button, Form, Input, Select, Table, Modal, message } from 'antd';
import React, { useState, useEffect } from 'react';
import './searchTableCoupon.css';
import { DeleteFilled, ExclamationCircleOutlined, EyeOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;

function SearchTableCoupon() {
    const [searchParams, setSearchParams] = useState({ codeCoupon: '' });
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newCoupon, setNewCoupon] = useState({ codeCoupon: '', discount: '', description: '', activeCoupon: true });

    // State để lưu coupon đang được xem chi tiết
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    // Fetch dữ liệu từ API
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/coupons', {
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
        fetchData(); // Lấy dữ liệu khi component mount
    }, []);

    // Handle thay đổi input tìm kiếm
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    };

    const handleReset = () => setSearchParams({ codeCoupon: '' });
    const handleReload = () => fetchData(); // Reload lại dữ liệu
    const handleAdd = () => setIsModalVisible(true); // Mở modal thêm mới coupon

    // Handle chỉnh sửa coupon
    const handleEdit = (record) => {
        setSelectedCoupon(record);
        setIsDetailModalVisible(true); // Mở modal chỉnh sửa coupon
    };

    const handleDetailModalClose = () => {
        setIsDetailModalVisible(false);
        setSelectedCoupon(null); // Đóng modal chi tiết
    };

    // Handle xóa coupon
    const handleDelete = async (codeCoupon) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/coupons/${codeCoupon}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                message.success('Đã xóa thành công!');
                fetchData(); // Tải lại dữ liệu
            } else throw new Error('Failed to delete coupon');
        } catch (error) {
            console.error('Error deleting coupon:', error);
            message.error('Có lỗi xảy ra khi xóa!');
        }
    };

    const showDeleteConfirm = (codeCoupon) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa mã giảm giá này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDelete(codeCoupon);
            },
        });
    };

    // Handle thay đổi thông tin coupon khi thêm mới
    const handleNewCouponChange = (name, value) => {
        setNewCoupon({ ...newCoupon, [name]: value });
    };

    // Save coupon mới
    const handleSaveNewCoupon = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/coupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newCoupon),
            });

            if (response.ok) {
                message.success('Mã giảm giá đã được thêm thành công!');
                setIsModalVisible(false);
                fetchData(); // Reload dữ liệu sau khi thêm
                setNewCoupon({ codeCoupon: '', discount: '', description: '', activeCoupon: true }); // Reset form
            } else throw new Error('Failed to add coupon');
        } catch (error) {
            console.error('Error adding coupon:', error);
            message.error('Kiểm tra dữ liệu thêm mới đã bị trùng!');
        }
    };

    // Cập nhật coupon đã chọn
    const handleUpdateCoupon = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/coupons/${selectedCoupon.codeCoupon}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    codeCoupon: selectedCoupon.codeCoupon,
                    discount: selectedCoupon.discount,
                    description: selectedCoupon.description,
                    activeCoupon: selectedCoupon.activeCoupon
                }),
            });

            if (response.ok) {
                message.success('Mã giảm giá đã được cập nhật thành công!');
                fetchData(); // Tải lại dữ liệu sau khi cập nhật
                handleDetailModalClose(); // Đóng modal
            } else throw new Error('Failed to update coupon');
        } catch (error) {
            console.error('Error updating coupon:', error);
            message.error('Có lỗi xảy ra khi cập nhật!');
        }
    };

    // Cấu hình cột của bảng
    const columns = [
        { title: 'Mã giảm giá', dataIndex: 'codeCoupon', key: 'codeCoupon' },
        { title: 'Chiết khấu', dataIndex: 'discount', key: 'discount' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Trạng thái',
            dataIndex: 'activeCoupon',
            key: 'activeCoupon',
            render: (activeCoupon) => (
                <Tag color={activeCoupon ? 'green' : 'red'}>
                    {activeCoupon ? 'Hoạt động' : 'Không hoạt động'}
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
                    <Button type="link" danger onClick={() => showDeleteConfirm(record.codeCoupon)}>
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
                    <h6>Tìm kiếm mã giảm giá</h6>
                    <Form className="custom-inline-form-coupon" layout="inline">
                        <Form.Item>
                            <Input
                                name="codeCoupon"
                                placeholder="Mã giảm giá"
                                value={searchParams.codeCoupon}
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
                <h6>Danh sách mã giảm giá</h6>
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
                    dataSource={data} // Kiểm tra data là mảng
                    rowKey="id"
                    pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
                />
            </div>

            {/* Add New Coupon Modal */}
            <Modal
                title="Thêm Mã Giảm Giá"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSaveNewCoupon}
            >
                <Form layout="vertical">
                    <Form.Item label="Chiết khấu">
                        <Input
                            value={newCoupon.discount}
                            onChange={(e) => handleNewCouponChange('discount', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả">
                        <Input
                            value={newCoupon.description}
                            onChange={(e) => handleNewCouponChange('description', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Trạng thái">
                        <Select
                            value={newCoupon.activeCoupon ? 'Hoạt động' : 'Không hoạt động'}
                            onChange={(value) => handleNewCouponChange('activeCoupon', value === 'Hoạt động')}
                        >
                            <Option value="Hoạt động">Hoạt động</Option>
                            <Option value="Không hoạt động">Không hoạt động</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Coupon Detail Modal */}
            <Modal
                title="Chi tiết Mã Giảm Giá"
                visible={isDetailModalVisible}
                onCancel={handleDetailModalClose}
                onOk={handleUpdateCoupon}
            >
                <Form layout="vertical">
                    <Form.Item label="Mã giảm giá">
                        <Input
                            value={selectedCoupon?.codeCoupon || ''}
                            onChange={(e) => setSelectedCoupon({ ...selectedCoupon, codeCoupon: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Chiết khấu">
                        <Input
                            value={selectedCoupon?.discount || ''}
                            onChange={(e) => setSelectedCoupon({ ...selectedCoupon, discount: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả">
                        <Input
                            value={selectedCoupon?.description || ''}
                            onChange={(e) => setSelectedCoupon({ ...selectedCoupon, description: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Trạng thái">
                        <Select
                            value={selectedCoupon?.activeCoupon ? 'Hoạt động' : 'Không hoạt động'}
                            onChange={(value) => setSelectedCoupon({ ...selectedCoupon, activeCoupon: value === 'Hoạt động' })}
                        >
                            <Option value="Hoạt động">Hoạt động</Option>
                            <Option value="Không hoạt động">Không hoạt động</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default SearchTableCoupon;
