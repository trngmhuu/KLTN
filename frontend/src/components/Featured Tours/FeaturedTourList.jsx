import React, { useEffect, useState } from "react";
import TourCard from "../../shared/TourCard";
import { Col, Spinner, Alert } from "reactstrap";

const FeaturedTourList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm lấy dữ liệu từ API
  const fetchTours = async () => {
    try {
      const response = await fetch("http://localhost:8080/tours");

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // Cập nhật state với chỉ các tour có isActive = true
      setTours(data.result?.filter(tour => tour.isActive) || []);
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      setError("Không thể tải danh sách tour."); // Cập nhật lỗi vào state
    } finally {
      setLoading(false); // Tắt loading sau khi gọi API
    }
  };

  // Gọi API khi component được render
  useEffect(() => {
    fetchTours();
  }, []);

  // Xử lý khi đang loading
  if (loading) {
    return <Spinner color="primary">Đang lấy danh sách tour...</Spinner>;
  }

  // Xử lý khi có lỗi
  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  // Xử lý khi không có tour nào
  if (tours.length === 0) {
    return <Alert color="info">Hiện tại không có tour nào đang nhận khách.</Alert>;
  }

  return (
    <>
      {tours.map((tour) => (
        <Col lg="3" className="mb-4" key={tour.id}>
          <TourCard tour={tour} />
        </Col>
      ))}
    </>
  );
};

export default FeaturedTourList;
