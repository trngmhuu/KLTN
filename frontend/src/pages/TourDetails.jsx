import React, { useState, useEffect } from "react";
import "../styles/tour-details.css";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import Booking from "../components/Booking/Booking"

// Hàm định dạng giá tiền với dấu chấm phân cách
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price); // Định dạng theo kiểu Việt Nam
};

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null); // State để lưu đối tượng tour
  const [loading, setLoading] = useState(true); // State để kiểm soát trạng thái loading

  const fetchTour = async () => {
    try {
      const response = await fetch(`http://localhost:8080/tours/by-tourcode/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setTour(data.result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tour:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {// Chỉ gọi API khi có tourCode
      fetchTour();
    }
  }, [id]); // Thêm fetchTour vào dependencies nếu cần

  if (loading) {
    return <p>Loading...</p>; // Hiển thị loading khi chờ dữ liệu
  }

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <div className="tour__content">
                <img src={tour.image} alt="" />
                <div className="tour__info">
                  <h1>{tour.name}</h1>
                  {/* <div className="d-flex align-items-center gap-5">
                    <span className="tour__rating d-flex align-items-center gap-1">
                      <i
                        className="ri-star-fill"
                        style={{ color: "var(--secondary-color)" }}
                      ></i>
                    </span>
                    <span>
                      <i className="ri-map-pin-fill"></i>
                    </span>
                  </div> */}
                  <div className="tour__extra-details">
                    <Row>
                      <Col lg="6">
                        <span style={{ whiteSpace: "nowrap" }}>
                          <i class="ri-calendar-line"></i>
                          Thời gian đi: {tour.durationTour}
                        </span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          <i class="ri-car-line"></i>
                          Phương tiện: {tour.vehicle}
                        </span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          <i class="ri-calendar-line"></i>
                          Ngày khởi hành: {tour.startDay ? tour.startDay.join(', ') : 'Chưa có ngày khởi hành'}
                        </span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          <i className="ri-money-dollar-circle-line"></i>
                          Giá <p style={{margin: "0", color: "orange", fontWeight: "bold"}}>{formatPrice(tour.price)}</p> VNĐ/người
                        </span>
                        
                        <span style={{ whiteSpace: "nowrap" }}>
                          <i class="ri-restart-line"></i>
                          Trạng thái: {tour.isActive ? "Đang nhận khách" : "Chưa thể đặt"}
                        </span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          <i class="ri-map-pin-line"></i>
                          Khởi hành từ: {tour.locationStart}
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <h2>Lịch trình</h2>
                  <p>{tour.description}</p>
                </div>
              </div>
            </Col>
            <Col lg="4">
              <Booking tour={tour} />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default TourDetails;
