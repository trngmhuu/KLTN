import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Input, Form, Modal, Select, Tag, message } from 'antd';
import { PlusCircleOutlined, ReloadOutlined, DeleteFilled, EyeOutlined } from '@ant-design/icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

function SearchTable() {
    const [searchParams, setSearchParams] = useState({
        username: '',
        email: '',
        phoneNumber: '',
    });

    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleEye, setIsModalVisibleEye] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        address: '',
        gender: true,
        isActive: true,
        roles: [],
    });
    const [selectedUser, setSelectedUser] = useState(null); // New state for selected user

    const fetchData = async (params = {}) => {
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`https://tourwebbe.onrender.com/users/search?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result); // Kiểm tra cấu trúc dữ liệu trả về
                setData(result.result); // Gán dữ liệu trả về vào state
            } else {
                throw new Error('Không thể lấy dữ liệu người dùng');
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };


    useEffect(() => {
        fetchData(); // Fetch data initially
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({
            ...searchParams,
            [name]: value,
        });
    };

    const handleSearch = () => {
        fetchData(searchParams); // Pass searchParams to fetchData
    };

    const handleReset = () => {
        setSearchParams({
            username: '',
            email: '',
            phoneNumber: '',
        });
        fetchData(); // Reset data to show all users
    };

    const handleReload = () => {
        fetchData(); // Reload all data
    };

    const handleAdd = () => {
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setSelectedUser(record); // Set the selected user
        setIsModalVisibleEye(true);  // Show the modal
    };

    const handleDelete = async (email) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://tourwebbe.onrender.com/users/${email}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const result = await response.json();
                console.log('User deleted:', result);
                fetchData(); // Reload data after delete
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const showDeleteConfirm = (email) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa người dùng này?',
            icon: <ExclamationCircleOutlined />,
            content: `Email: ${email}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDelete(email);
            },
            onCancel() {
                console.log('Hủy hành động xóa');
            },
        });
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value,
        });
    };

    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneNumberRef = useRef(null);
    const passwordRef = useRef(null);
    const rolesRef = useRef(null);

    const handleSaveNewUser = async () => {

        // Biểu thức Regex cho email và số điện thoại
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneNumberRegex = /^[0-9]{10,11}$/;

        if (!newUser.username) {
            usernameRef.current.focus();
            return message.error('Tên không được để trống và không chứa ký tự đặc biệt');
        }

        if (!newUser.email || !emailRegex.test(newUser.email)) {
            emailRef.current.focus();
            return message.error('Email không hợp lệ hoặc để trống');
        }

        if (!newUser.phoneNumber || !phoneNumberRegex.test(newUser.phoneNumber)) {
            phoneNumberRef.current.focus();
            return message.error('Số điện thoại không hợp lệ (10-11 chữ số)');
        }

        if (!newUser.password) {
            passwordRef.current.focus();
            return message.error('Mật khẩu không được để trống');
        }

        if (!newUser.roles || newUser.roles.length === 0) {
            rolesRef.current.focus();
            return message.error('Vai trò không được để trống');
        }


        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://tourwebbe.onrender.com/users/adminCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('User added:', result);
                setIsModalVisible(false);
                fetchData(); // Reload data after adding user
                setNewUser({
                    username: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    address: '',
                    gender: true, 
                    isActive: true,      
                    roles: '',
                });
                message.success('Người dùng đã được thêm thành công');
            } else {
                const errorData = await response.json();
                if (errorData.message && errorData.message.includes('User existed')) {
                    message.error('Người dùng đã tồn tại. Vui lòng kiểm tra lại email.');
                } else {
                    throw new Error(errorData.message || 'Failed to add user');
                }
            }
        } catch (error) {
            console.error('Error adding user:', error);
            message.error(error.message);
        }
    };

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Họ tên',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => (gender ? 'Nam' : 'Nữ'),
        },
        // {
        //     title: 'Trạng thái',
        //     key: 'isActive',
        //     render: (_, { isActive }) => (
        //         <Tag color={isActive ? 'green' : 'volcano'}>
        //             {isActive ? 'Hoạt động' : 'Không hoạt động'}
        //         </Tag>
        //     ),
        // },
        {
            title: 'Vai trò',
            dataIndex: 'roles',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <div className="action-buttons">
                    <Button type="link" onClick={() => handleEdit(record)}><EyeOutlined /></Button>
                    <Button type="link" danger onClick={() => showDeleteConfirm(record.email)}><DeleteFilled /></Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <ul className='searchtable-container'>
                <li className='search-container'>
                    <h6>Tìm kiếm nhân viên</h6>
                    <Form className="custom-inline-form" layout="inline">
                        <Form.Item>
                            <Input
                                name="username"
                                placeholder="Tên"
                                value={searchParams.username}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                name="email"
                                placeholder="Email"
                                value={searchParams.email}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                name="phoneNumber"
                                placeholder="Số điện thoại"
                                value={searchParams.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleReset}>
                                Xóa Trắng
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleSearch}>
                                Tìm kiếm
                            </Button>
                        </Form.Item>
                    </Form>
                </li>
            </ul>

            <div className='table-header'>
                <h6>Bảng dữ liệu</h6>
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
                    pagination={{
                        pageSize: 3,
                        showSizeChanger: true,
                        pageSizeOptions: ['3', '5', '10'],
                    }}
                />
            </div>

            {/* Modal để thêm người dùng mới */}
            <Modal
                title="Thêm người dùng mới"
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    // setNewUser({
                    //     username: '',
                    //     email: '',
                    //     phoneNumber: '',
                    //     password: '',
                    //     roles: '', // Đặt lại giá trị mặc định
                    // });
                }}
                onOk={handleSaveNewUser}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên">
                        <Input
                            ref={usernameRef}
                            name="username"
                            value={newUser.username}
                            onChange={handleNewUserChange}
                        />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input
                            ref={emailRef}
                            name="email"
                            value={newUser.email}
                            onChange={handleNewUserChange}
                        />
                    </Form.Item>
                    <Form.Item label="Giới tính">
                        <Select
                            name="gender"
                            value={newUser.gender}
                            onChange={(value) => setNewUser({ ...newUser, gender: value })}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value={true}>Nam</Select.Option>
                            <Select.Option value={false}>Nữ</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Số điện thoại">
                        <Input
                            ref={phoneNumberRef}
                            name="phoneNumber"
                            value={newUser.phoneNumber}
                            onChange={handleNewUserChange}
                        />
                    </Form.Item>

                    <Form.Item label="Địa chỉ">
                        <Input
                            name="address"
                            value={newUser.address}
                            onChange={handleNewUserChange}
                        />
                    </Form.Item>

                    <Form.Item label="Mật khẩu">
                        <Input
                            ref={passwordRef}
                            name="password"
                            type="password"
                            value={newUser.password}
                            onChange={handleNewUserChange}
                        />
                    </Form.Item>

                    {/* <Form.Item label="Trạng thái tài khoản">
                        <Select
                            name="isActive"
                            value={newUser.isActive}
                            onChange={(value) => setNewUser({ ...newUser, isActive: value })}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value={true}>Đang hoạt động</Select.Option>
                            <Select.Option value={false}>Không hoạt động</Select.Option>
                        </Select>
                    </Form.Item> */}

                    <Form.Item label="Vai trò">
                        <Select
                            name="roles"
                            value={newUser.roles[0]}
                            onChange={(value) => setNewUser({ ...newUser, roles: [value] })}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="USER">User</Select.Option>
                            <Select.Option value="EMPLOYEE">Employee</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal để xem thông tin người dùng */}
            <Modal
                title="Thông tin người dùng"
                visible={isModalVisibleEye}
                onCancel={() => setIsModalVisibleEye(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisibleEye(false)}>
                        Đóng
                    </Button>
                ]}
            >
                {selectedUser && (
                    <div>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Tên:</strong> {selectedUser.username}</p>
                        <p><strong>Số điện thoại:</strong> {selectedUser.phoneNumber}</p>
                        <p><strong>Địa chỉ:</strong> {selectedUser.address}</p>
                        <p><strong>Giới tính:</strong> {selectedUser.gender ? 'Nam' : 'Nữ'}</p>
                        {/* <p><strong>Trạng thái:</strong> {selectedUser.isActive ? 'Hoạt động' : 'Không hoạt động'}</p> */}
                        <p><strong>Vai trò:</strong> {selectedUser.roles.join(', ')}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default SearchTable;
