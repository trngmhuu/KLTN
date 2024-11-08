import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./tour-card.css";

// Hàm định dạng giá tiền với dấu chấm phân cách
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price); // Định dạng theo kiểu Việt Nam
};

const TourCard = ({ tour }) => {
  const { tourCode, name, image, price, durationTour } = tour;

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <Link to={`/tours/${tourCode}`}><img src={image} alt="tour-img" /></Link>
        </div>
        <CardBody>
          <h5 className="tour__title">
            <Link to={`/tours/${tourCode}`}>{name}</Link>
          </h5>
          Thời gian đi: <span style={{fontWeight: 500}}>{durationTour}</span>
          {/* <div className="unfixedPrice">{formatPrice(price + price * 25/100)} VNĐ/người</div> */}
          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              {formatPrice(price)} <span style={{fontSize: "1rem"}}> VNĐ/người</span>
            </h5>
            <button className="btn booking__btn">
              <Link to={`/tours/${tourCode}`}>Đặt ngay</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;
