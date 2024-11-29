import React, { useRef } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";

const SearchBarBooking = ({ onBookingFound }) => {
  const inputRef = useRef(); // Tham chiếu để lấy giá trị input

  const searchHandler = async () => {
    const bookingCode = inputRef.current.value.trim(); // Lấy giá trị từ ô input
    if (!bookingCode) {
      console.error("Vui lòng nhập mã booking.");
      return;
    }

    try {
      // Gửi GET request tới endpoint cụ thể
      const response = await fetch(
        `http://localhost:8080/bookings/by-bookingcode/${bookingCode}`
      );
      if (!response.ok) {
        throw new Error("Không tìm thấy thông tin booking.");
      }
      const booking = await response.json();
      onBookingFound(booking.result); // Gọi callback và truyền dữ liệu lên SearchBookingList
    } catch (err) {
      console.error("Lỗi:", err.message);
      onBookingFound(null); // Truyền null nếu không tìm thấy booking
    }
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri-barcode-line"></i>
            </span>
            <div>
              <h6>Tra cứu thông tin tour bạn đã đặt</h6>
              <input
                type="text"
                placeholder="Nhập mã booking"
                ref={inputRef} // Tham chiếu đến input
              />
            </div>
          </FormGroup>

          <span
            className="search__icon"
            type="submit"
            onClick={searchHandler}
          >
            <i className="ri-search-line"></i>
          </span>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBarBooking;
