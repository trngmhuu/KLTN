import React, { useState, useEffect } from 'react'
import './loginForm.css'
import { FaLock, FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import loginImg from "../../assets/images/login.png"
import userIcon from "../../assets/images/user.png"
import { Link } from "react-router-dom"

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Gọi API login bằng fetch
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,  // Hoặc tùy theo tên trường trong AuthenticationRequest
                    password: password,  // Tên trường trong AuthenticationRequest
                }),
            });

            const data = await response.json();
            const token = data.result.token; // Lấy token từ phản hồi API

            // Tách phần payload từ token
            const base64Url = token.split('.')[1]; // Phần thứ hai của token là payload
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Thay thế các ký tự Base64 URL-safe
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            // Chuyển đổi chuỗi JSON thành object
            const decodedPayload = JSON.parse(jsonPayload);
            localStorage.setItem('scope', decodedPayload.scope);


            if (response.ok && (decodedPayload.scope === 'ADMIN' || decodedPayload.scope === 'EMPLOYEE')) {
                // Đăng nhập thành công, điều hướng về trang chủ
                localStorage.setItem('token', token);
                // Gọi API để lấy thông tin myinfo
                const myinfoResponse = await fetch('http://localhost:8080/users/myinfo', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const myinfoData = await myinfoResponse.json();
                if (myinfoResponse.ok) {
                    // Nếu API trả về trường result, lấy result
                    const userInfo = myinfoData.result || myinfoData;  // Sử dụng trực tiếp myinfoData nếu không có result
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    // Điều hướng đến trang chủ
                    navigate('/admin/home');
                } else {
                    alert('Không lấy được thông tin người dùng.');
                }
            } else {
                alert('Đăng nhập thất bại! Bạn không có quyền truy cập.');
            }
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            alert('Đăng nhập thất bại! Vui lòng thử lại sau.');
        }
    };

    return (
        <section>
            <Container>
                <Row>
                    <Col lg="12" className="m-autos">
                        <div className="login__container d-flex justify-content-between">
                            <div className="login__img">
                                <img src={loginImg} alt="" />
                            </div>

                            <div className='login__form'>
                                <div className="user">
                                    <img src={userIcon} alt="" />
                                </div>
                                <h2>HTravel</h2>

                                <Form>
                                    <FormGroup>
                                        <div className="icon_section">
                                            <FaUser className='icon' />
                                        </div>
                                        <div className='input_section'>
                                            <input
                                                type='text'
                                                placeholder='Email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </FormGroup>
                                    <div style={{height: "50px"}}></div>
                                    <FormGroup>
                                        <div className="icon_section">
                                            <FaLock className='icon' />
                                        </div>
                                        <div className="input_section">
                                            <input
                                                type='password'
                                                placeholder='Mật khẩu'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </FormGroup>
                                    <Button className="btn secondary__btn auth__btn" type="submit" onClick={handleLogin}>Đăng nhập</Button>
                                </Form>
                                {/* <p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p> */}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default LoginForm