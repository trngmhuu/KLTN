import React, { useState, useRef } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap"
import "../styles/login.css"
import registerImg from "../assets/images/register.png"
import userIcon from "../assets/images/user.png"
import { Link } from "react-router-dom"

const Register = () => {
  const [creadentials, setCredentials] = useState({
    fullName: undefined,
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
                <img src={registerImg} alt="" />
              </div>

              <div className='login__form'>
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Đăng ký</h2>

                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input type="text" placeholder='Họ tên' required id='fullName' onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <input type="password" placeholder='Mật khẩu' required id='password' onChange={handleChange} />
                  </FormGroup>
                  <Button className="btn secondary__btn auth__btn" type="submit">Đăng ký</Button>
                </Form>
                <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Register
