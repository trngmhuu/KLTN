import React from 'react'
import "./newsletter.css"
import {Container, Row, Col} from "reactstrap"
import maleTourist from "../assets/images/male-tourist.png"

const Newsletter = () => {
  return <section className='newsletter'>
    <Container>
        <Row>
            <Col lg="6">
                <div className="newsletter__content">
                    <h2>Đăng ký ngay để không bỏ lỡ các deal du lịch nóng hổi!</h2>
                    <div className="newsletter__input">
                        <input type="email" placeholder='Nhập email của bạn'/>
                        <button className="btn newsletter__btn">
                            Đăng ký
                        </button>
                    </div>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                    Voluptas praesentium adipisci fugit molestias veniam voluptatem aliquid deleniti enim eos? Doloribus nostrum facilis assumenda itaque eius aut atque rem nobis magnam!</p>
                </div>
            </Col>
            <Col lg="6">
                <div className="newsletter__img">
                    <img src={maleTourist} alt="" />
                </div>
            </Col>
        </Row>
    </Container>
  </section>
}

export default Newsletter
