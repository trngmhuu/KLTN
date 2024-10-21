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
                    <p>Chúng tôi sẽ gửi thông báo đến ngay cho bạn khi chương trình giảm giá diễn ra</p>
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
