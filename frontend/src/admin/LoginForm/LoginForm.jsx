import React, { useState } from 'react';
import './loginForm.css';
import { FaLock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImg from "../../assets/images/loginImg.jpg";
import userIcon from "../../assets/images/user.png";

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        // Regex để kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Kiểm tra email và mật khẩu trước khi gửi yêu cầu đăng nhập
        if (!email) {
            toast.error('Email không được để trống');
            return;
        }
        if (!validateEmail(email)) {
            toast.error('Email không hợp lệ');
            return;
        }
        if (!password) {
            toast.error('Mật khẩu không được để trống');
            return;
        }

        // Tiếp tục xử lý đăng nhập nếu các trường hợp đều hợp lệ
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error('Đăng nhập thất bại! Vui lòng kiểm tra thông tin đăng nhập.');
                return;
            }

            const token = data.result.token;

            // Giải mã token để lấy thông tin payload
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const decodedPayload = JSON.parse(jsonPayload);

            // Lưu email và token vào localStorage
            const user = { email, scope: decodedPayload.scope };
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            if (decodedPayload.scope === 'ADMIN' || decodedPayload.scope === 'EMPLOYEE') {
                // Gọi API để lấy roles và username của người dùng
                const myinfoResponse = await fetch('http://localhost:8080/users/myinfo', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                const myinfoData = await myinfoResponse.json();
                if (myinfoResponse.ok) {
                    // Chỉ lưu roles và username vào localStorage
                    const { roles, username } = myinfoData.result || myinfoData;
                    const userInfo = { roles, username };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));

                    // Điều hướng đến trang chủ admin
                    navigate('/admin/home');
                } else {
                    toast.error('Không lấy được thông tin người dùng.');
                }
            } else {
                toast.error('Bạn không có quyền truy cập.');
            }
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            toast.error('Đăng nhập thất bại! Vui lòng thử lại sau.');
        }
    };

    return (
        <section className='sectionLoginForm'>
            <ToastContainer /> {/* Hiển thị thông báo */}
            <Container>
                <Row>
                    <Col lg="12" className="m-autos">
                        <div className="login__container d-flex justify-content-center">
                            <div className='login__form'>
                                <div className="user">
                                    <img src={userIcon} alt="" />
                                </div>
                                <h2>Admin</h2>

                                <Form onSubmit={handleLogin}>
                                    <FormGroup>
                                        <div className="icon_section">
                                            <FaUser className='icon' />
                                        </div>
                                        <div className='input_section'>
                                            <input
                                                type='text'
                                                placeholder='Nhập email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </FormGroup>
                                    <div style={{ height: "50px" }}></div>
                                    <FormGroup>
                                        <div className="icon_section">
                                            <FaLock className='icon' />
                                        </div>
                                        <div className="input_section">
                                            <input
                                                type='password'
                                                placeholder='Nhập mật khẩu'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </FormGroup>
                                    <Button
                                        style={{ backgroundColor: '#28a745', color: '#fff', borderColor: '#28a745'}}
                                        className="auth__btn"
                                        type="submit"
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default LoginForm;
