import React from 'react';
import "./footer.css";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

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
    path: "/tours/domestic",
    display: "Tour trong nước",
  },
  {
    path: "/tours/international",
    display: "Tour nước ngoài",
  },
];

const Footer = () => {

  const year = new Date().getFullYear();

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col lg="3">
            <div className="logo">
              <Link to="/home" onClick={scrollToTop}><img src={logo} alt="" /></Link>
              <div className="social__links d-flex align-items-center gap-4">
                <span>
                  <a href="https://www.facebook.com/huu.minh.7583/"><i className="ri-facebook-circle-fill"></i></a>
                </span>
                <span>
                  <a href="https://www.instagram.com/trngmhuu/"><i className="ri-instagram-line"></i></a>
                </span>
                <span>
                  <a href="https://github.com/trngmhuu"><i className="ri-github-line"></i></a>
                </span>
                <span>
                  <a href="https://www.youtube.com/@whisdoom7324"><i className="ri-youtube-line"></i></a>
                </span>
              </div>
            </div>
          </Col>
          <Col lg="3">
            <ListGroup className="footer__quick-links">
              {
                quick_links_1.map((item, index) => (
                  <ListGroupItem key={index} className="ps-0 border-0">
                    <Link to={item.path} onClick={scrollToTop}>{item.display}</Link>
                  </ListGroupItem>
                ))
              }
            </ListGroup>
          </Col>
          <Col lg="3">
            <ListGroup className="footer__quick-links">
              {
                quick_links_2.map((item, index) => (
                  <ListGroupItem key={index} className="ps-0 border-0">
                    <Link to={item.path} onClick={scrollToTop}>{item.display}</Link>
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
                  <span><i className="ri-map-pin-line"></i></span>
                  Địa chỉ:
                </h6>
                <p className='mb-0'>Bình Thạnh, TP.HCM</p>
              </ListGroupItem>
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span><i className="ri-mail-line"></i></span>
                  Email:
                </h6>
                <p className='mb-0'>minhhuu0705@gmail.com</p>
              </ListGroupItem>
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span><i className="ri-phone-line"></i></span>
                  Số điện thoại:
                </h6>
                <p className='phoneNumberGlitch mb-0'>0775734129</p>
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col lg="12" className="text-center pt-5">
            <p className="copyright">
              Copyright {year}, designed and developed by Truong Minh Huu, Nguyen Viet Ngoc Thinh. All rights reserved
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
