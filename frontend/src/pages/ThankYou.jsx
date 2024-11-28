import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import "../styles/thank-you.css";

// Hàm định dạng giá tiền với dấu chấm phân cách
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price); // Định dạng theo kiểu Việt Nam
};

const ThankYou = () => {
  const location = useLocation();
  const [paymentUrl, setPaymentUrl] = useState('');
  const bookingData = location.state?.bookingData;

  useEffect(() => {
    // Gọi API để lấy liên kết thanh toán từ backend
    if (bookingData) {
      const fetchPaymentLink = async () => {
        try {
          const response = await fetch("http://localhost:8080/payment/payment-link", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookingCode: bookingData.bookingCode, totalMoney: bookingData.totalMoney }), // Gửi thêm thông tin tổng tiền
          });

          if (!response.ok) {
            throw new Error("Failed to create payment link");
          }

          const data = await response.json();
          setPaymentUrl(data.paymentUrl);  // Giả sử backend trả về paymentUrl
        } catch (error) {
          console.error("Error fetching payment link:", error);
        }
      };

      fetchPaymentLink();
    }
  }, [bookingData]);

  const handlePayment = () => {
    if (paymentUrl) {
      // Chuyển hướng người dùng đến trang thanh toán của Stripe
      window.location.href = paymentUrl;
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="pt-5 text-center">
            <div className="thank__you">
              <span>
                <i className="ri-checkbox-circle-line"></i>
              </span>
              <h1 className="mb-3 fw-semibold">Thank You</h1>
              <h3 className="mb-4">Đặt tour thành công</h3>
              {bookingData ? (
                <div>
                  <h3>Thông tin đặt tour:</h3>
                  <p><strong>Mã booking:</strong> {bookingData.bookingCode}</p>
                  <p><strong>Tên khách hàng:</strong> {bookingData.customerName}</p>
                  <p><strong>Số lượng khách:</strong> {bookingData.numberOfCustomer}</p>
                  <p><strong>Ngày đi dự kiến:</strong> {bookingData.expectedDate}</p>
                  <p><strong>Tổng tiền:</strong> {formatPrice(bookingData.totalMoney)} VNĐ</p>
                </div>
              ) : (
                <p>Không tìm thấy thông tin đặt tour.</p>
              )}
              <div className="button__section">
                <Button className="toHomeButton btn primary__btn">
                  <Link className="textInBtn" to="/home">Quay lại trang chủ</Link>
                </Button>
                <Button
                  className="paymentButton btn primary__btn"
                  onClick={handlePayment}
                >
                  <span className="textInBtn">Thanh toán ngay</span>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ThankYou;