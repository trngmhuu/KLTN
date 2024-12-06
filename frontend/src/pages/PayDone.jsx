import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import "../styles/thank-you.css";
import { useNotifications } from '../context/NotificationContext';

const PayDone = () => {
  const [loading, setLoading] = useState(true); // Để theo dõi trạng thái đang tải
  const [paymentStatus, setPaymentStatus] = useState(""); // Để lưu trạng thái thanh toán
  const [error, setError] = useState(""); // Để lưu lỗi nếu có
  const { addNotification } = useNotifications();
  const location = useLocation(); // Để lấy session_id từ URL

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      fetch(`https://tourwebbe.onrender.com/pay/done?session_id=${sessionId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Có lỗi xảy ra khi xử lý thanh toán");
          }
          return response.json(); // Chuyển đổi response thành JSON
        })
        .then((data) => {
          setLoading(false);
          if (data.bookingCode) {
            addNotification(`Khách hàng vừa thanh toán cho đơn đặt tour có mã ${data.bookingCode}`);
          }
          setPaymentStatus(data.message); // Sử dụng message từ backend
        })
        .catch((error) => {
          setLoading(false);
          setError(error.message);
        });
    } else {
      setLoading(false);
      setError("Không tìm thấy session_id.");
    }
  }, [location]);


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
              {loading ? (
                <h3 className="mb-4">Đang xử lý thanh toán...</h3>
              ) : error ? (
                <h3 className="mb-4 success-message">{"Thanh toán thành công!"}</h3>
              ) : (
                <h3 className="mb-4 success-message">{"Thanh toán thành công!"}</h3>
              )}

              <Button className="btnToHome btn primary__btn">
                <Link className="textInBtn" to="/home">
                  Quay lại trang chủ
                </Link>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PayDone;