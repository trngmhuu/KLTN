import React from 'react';
import "./footer.css"
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png"

const quick_links_1 = [
  {
    path: "/home",
    display: "Trang chủ",
  },
  {
    path: "/about",
    display: "Về chúng tôi",
  },
];

const quick_links_2 = [
  {
    path: "/tours",
    display: "Các loại tour",
  },
];

const Footer = () => {

  const year = new Date().getFullYear()

  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col lg="3">
            <div className="logo">
              <Link to="/home"><img src={logo} alt="" /></Link>
              <div className="social__links d-flex align-items-center gap-4">
                <span>
                  <a href="https://www.facebook.com/huu.minh.7583/"><i class="ri-facebook-circle-fill"></i></a>
                </span>
                <span>
                  <a href="https://www.instagram.com/trngmhuu/"><i class="ri-instagram-line"></i></a>
                </span>
                <span>
                  <a href="https://github.com/trngmhuu"><i class="ri-github-line"></i></a>
                </span>
                <span>
                  <a href="https://www.youtube.com/@whisdoom7324"><i class="ri-youtube-line"></i></a>
                </span>
              </div>
            </div>
          </Col>
          <Col lg="3">
            {/* <h5 className='footer__link-title'>Discovery</h5> */}
            <ListGroup className="footer__quick-links">
              {
                quick_links_1.map((item, index) => (
                  <ListGroupItem key={index} className="ps-0 border-0">
                    <Link to={item.path}>{item.display}</Link>
                  </ListGroupItem>
                ))
              }
            </ListGroup>
          </Col>
          <Col lg="3">
            {/* <h5 className='footer__link-title'>Quick Links</h5> */}
            <ListGroup className="footer__quick-links">
              {
                quick_links_2.map((item, index) => (
                  <ListGroupItem key={index} className="ps-0 border-0">
                    <Link to={item.path}>{item.display}</Link>
                  </ListGroupItem>
                ))
              }
            </ListGroup>
          </Col>
          <Col lg="3">
            <h5 className='footer__link-title'>Thông tin liên lạc</h5>
            <ListGroup className="footer__quick-links">
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span><i class="ri-map-pin-line"></i></span>
                  Địa chỉ
                </h6>
                <p className='mb-0'>Bình Thạnh, TP.HCM</p>
              </ListGroupItem>
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span><i class="ri-mail-line"></i></span>
                  Email
                </h6>
                <p className='mb-0'>minhhuu0705@gmail.com</p>
              </ListGroupItem>
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span><i class="ri-phone-line"></i></span>
                  Số điện thoại
                </h6>
                <p className='mb-0'>(+84) 77-5734-129</p>
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col lg="12" className="text-center pt-5">
            <p className="copyright">
              Copyright {year}, designed and developed by Truong Minh Huu. All rights reserved
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
