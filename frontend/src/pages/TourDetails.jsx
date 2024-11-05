import React, { useState, useEffect, useCallback } from "react";
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
  // Hàm kiểm tra xem startDay có phải là đầy đủ từ thứ 2 -> chủ nhật không
  const isFullWeekSchedule = () => {
    const weekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    return weekdays.every(day => tour.startDay.includes(day));
  };
  const fetchTour = useCallback(async () => {
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
  }, [id]); // thêm 'id' vào đây

  useEffect(() => {
    if (id) { // Chỉ gọi API khi có tourCode
      fetchTour();
    }
  }, [id, fetchTour]); // id và fetchTour được đồng bộ


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
                          <span className="titles">Thời gian đi:</span>
                          {tour.durationTour}
                        </span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          <i class="ri-car-line"></i>
                          <span className="titles">Phương tiện:</span>
                          {tour.vehicle}
                        </span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          <i class="ri-calendar-line"></i>
                          <span className="titles">Ngày khởi hành:</span>
                          {isFullWeekSchedule() ? 'Hàng ngày' : tour.startDay.join(', ')}
                        </span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          <i className="ri-money-dollar-circle-line"></i>
                          <span className="titles">Giá:</span>
                          <p style={{ margin: "0", color: "orange", fontWeight: "bold" }}>{formatPrice(tour.price)}</p> VNĐ/người
                        </span>

                        <span style={{ whiteSpace: "nowrap" }}>
                          <i class="ri-restart-line"></i>
                          <span className="titles">Trạng thái:</span>
                          <span className="status">{tour.isActive ? "Đang nhận khách" : "Chưa thể đặt"}</span>
                        </span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          <i class="ri-map-pin-line"></i>
                          <span className="titles">Khởi hành từ:</span>
                          {tour.locationStart}
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
