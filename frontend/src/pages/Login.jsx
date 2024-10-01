import React, { useState, useRef } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap"
import "../styles/login.css"
import loginImg from "../assets/images/login.png"
import userIcon from "../assets/images/user.png"
import { Link } from "react-router-dom"

const Login = () => {
  const [creadentials, setCredentials] = useState({
    phoneNumber: undefined,
    password: undefined
  });

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = e => {
    e.preventDefault()
  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-autos">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="" />
              </div>

              <div className='login__form'>
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Đăng nhập</h2>

                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input type="text" placeholder='Số điện thoại' required id='phoneNumber' onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <input type="password" placeholder='Mật khẩu' required id='password' onChange={handleChange} />
                  </FormGroup>
                  <Button className="btn secondary__btn auth__btn" type="submit">Đăng nhập</Button>
                </Form>
                <p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Login
