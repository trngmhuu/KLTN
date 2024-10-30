import React, { useState, useEffect } from 'react'
import './loginForm.css'
import { FaLock, FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import loginImg from "../../assets/images/login.png"
import userIcon from "../../assets/images/user.png"

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
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
                alert(data.message || 'Đăng nhập thất bại! Vui lòng kiểm tra thông tin đăng nhập.');
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
                    alert('Không lấy được thông tin người dùng.');
                }
            } else {
                alert('Bạn không có quyền truy cập.');
            }
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            alert('Đăng nhập thất bại! Vui lòng thử lại sau.');
        }
    };
    



    return (
        <section className='sectionLoginForm'>
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
                                    <div style={{ height: "50px" }}></div>
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