import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, message, Form, Input, Select, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title } = Typography;

function NavAvatar() {
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal for user info
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false); // Modal for password change
    const [userInfo, setUserInfo] = useState(null); // User info state
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm(); // Form for password change

    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Fetch user info from API
    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/users/myinfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Error fetching user info');
            }

            const data = await response.json();
            setUserInfo(data);
            form.setFieldsValue({
                username: data.username,
                email: data.email,
                phoneNumber: data.phoneNumber,
                address: data.address,
                gender: data.gender ? 'Nam' : 'Nữ',
                dateOfBirth: moment(data.dateOfBirth),
            });
        } catch (error) {
            console.error('Error fetching user info:', error);
            message.error('Error fetching user info.');
        } finally {
            setLoading(false);
        }
    };

    // Show user info modal
    const showModal = () => {
        fetchUserInfo();
        setIsModalVisible(true);
    };

    // Show password change modal
    const showPasswordModal = () => {
        setIsPasswordModalVisible(true);
    };

    // Close modals
    const handleCancel = () => {
        setIsModalVisible(false);
        setIsPasswordModalVisible(false);
    };

    // Logout user
    const handleLogout = () => {
        localStorage.removeItem('token');
        message.success('Logged out successfully!');
        navigate('/admin/login');
    };

    // Update user info
    const handleUpdate = async (values) => {
        try {
            const response = await fetch(`http://localhost:8080/users/id/${userInfo.idAsString}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    address: values.address,
                    gender: values.gender === 'Male' ? true : false,
                    dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
                }),
            });

            if (!response.ok) {
                throw new Error('Error updating user info');
            }

            const data = await response.json();
            message.success('User info updated successfully!');
            setUserInfo(data);
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error updating user info:', error);
            message.error('Error updating user info.');
        }
    };

    const handlePasswordUpdate = async (values) => {
        console.log('User info:', userInfo);  // Kiểm tra giá trị của userInfo
        console.log('User ID:', userInfo.idAsString);  // Kiểm tra giá trị của idAsString

        if (!userInfo || !userInfo.idAsString) {
            message.error('User info or ID is not available.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/users/idpassword/${userInfo.idAsString}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    password: values.newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Error updating password');
            }

            message.success('Password updated successfully!');
            setIsPasswordModalVisible(false);
        } catch (error) {
            console.error('Error updating password:', error);
            message.error('Error updating password.');
        }
    };





    return (
        <div className='nav-item dropdown pe-3'>
            <a className='nav-link nav-profile d-flex align-items-center pe-0' href='#' data-bs-toggle='dropdown'>
                <span className='d-none d-md-block dropdown-toggle ps-2'>Admin</span>
            </a>

            <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile'>
                <li className='dropdown-header'>
                    <h6>Admin</h6>
                    <span>Online</span>
                </li>
                <li><hr className='dropdown-divider' /></li>

                <li>
                    <a className='dropdown-item d-flex align-items-center' onClick={showModal}>
                        <i className='bi bi-person'></i>
                        <span>Thông tin người dùng</span>
                    </a>
                </li>

                <hr className='dropdown-divider' />

                <li>
                    <a className='dropdown-item d-flex align-items-center' onClick={showPasswordModal}>
                        <i className='bi bi-key'></i>
                        <span>Đổi mật khẩu</span>
                    </a>
                </li>

                <li><hr className='dropdown-divider' /></li>

                <li>
                    <a className='dropdown-item d-flex align-items-center' onClick={handleLogout}>
                        <i className='bi bi-box-arrow-right'></i>
                        <span>Đăng xuất</span>
                    </a>
                </li>
                <li><hr className='dropdown-divider' /></li>
            </ul>

            {/* Modal for user info */}
            <Modal
                title="Thông tin người dùng"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                {userInfo ? (
                    <Form form={form} layout="vertical" onFinish={handleUpdate}>
                        <Form.Item label="Tên" name="username" rules={[{ required: true, message: 'Họ tên không được bỏ trống!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email không được bỏ trống!' }]}>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: 'Please enter your phone number!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Địa chủ" name="address" rules={[{ required: true, message: 'Please enter your address!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
                            <Select>
                                <Select.Option value="Nam">Nam</Select.Option>
                                <Select.Option value="Nữ">Nữ</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: 'Please select your date of birth!' }]}>
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>Cập nhật</Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <p>Đang tải người dùng...</p>
                )}
            </Modal>

            {/* Modal for password change */}
            {/* Modal for password change */}
            <Modal
                title="Đổi mật khẩu"
                visible={isPasswordModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form form={passwordForm} layout="vertical" onFinish={handlePasswordUpdate}>
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 1, message: 'Mậy khẩu vui lòng không bỏ trống.' }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Nhập mật khẩu trên để xác nhận!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>


            </Modal>


        </div>
    );
}

export default NavAvatar;
