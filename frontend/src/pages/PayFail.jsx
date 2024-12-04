import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/thank-you.css";

const PayFail = () => {

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="pt-5 text-center">
            <div className="thank__you">
              <span>
                <i className="ri-close-circle-line" style={{ color: "red" }}></i>
              </span>
              <h1 className="mb-3 fw-semibold">Sorry</h1>
              <h3 className="mb-4">Thanh toán Online thất bại</h3>

              <Button className="btnToHome btn primary__btn">
                <Link className="textInBtn" to="/home">Quay lại trang chủ</Link>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PayFail;