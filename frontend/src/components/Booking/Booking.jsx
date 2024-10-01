import React, { useState } from "react";
import "./booking.css";
import {
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Button,
  List,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

const Booking = ({ tour, avgRating }) => {
  const { price, reviews } = tour;
  const navigate = useNavigate()
  const [creadentials, setCredentials] = useState({
    userId: "01",
    userEmail: "minhhuu0705@gmail.com",
    fullName: "Truong Minh Huu",
    phoneNumber: "0775734129",
    guestSize: 1,
    bookingDate: "",
  });
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const serviceFee = 10
  const totalAmount = Number(price) * Number(creadentials.guestSize) + Number(serviceFee)

  const handleClick = e => {
    e.preventDefault();
    navigate("/thank-you");
  };

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ${price}
          <span>/người</span>
        </h3>
        <span className="tour__rating d-flex align-items-center">
          <i class="ri-star-s-fill"></i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>
      {/*======= booking form start ======= */}
      <div className="booking__form">
        <h5>Thông tin đăng ký</h5>
        <Form className="booing__info-form" onSubmit={handleClick}>
          <FormGroup>
            <input
              type="text"
              placeholder="Họ tên"
              id="fullName"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <input
              type="text"
              placeholder="Số điện thoại"
              id="phoneNumber"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input
              type="date"
              placeholder="Ngày đi"
              id="bookingDate"
              required
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Số lượng hành khách"
              id="guestSize"
              required
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </div>
      {/*======= booking form end ======= */}

      {/*======= booking bottom ======= */}
      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              ${price}
              <i class="ri-close-line"></i> 1 người
            </h5>
            <span>${price}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Thuế</h5>
            <span>${serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Tổng cộng</h5>
            <span>${totalAmount}</span>
          </ListGroupItem>
        </ListGroup>
        <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>Đặt tour</Button>
      </div>
    </div>
  );
};

export default Booking;
