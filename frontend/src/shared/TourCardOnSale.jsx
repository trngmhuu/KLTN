import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./tour-card-on-sale.css";

// Hàm định dạng giá tiền với dấu chấm phân cách
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price); // Định dạng theo kiểu Việt Nam
};

const TourCardOnSale = ({ tour }) => {
  const { tourCode, name, image, price, durationTour, percentSale } = tour;

  return (
    <div className="tour_card">
      <Card>
        <div className="tour_img">
          <Link to={`/tours/${tourCode}`}><img src={image} alt="tour-img" /></Link>
          <span>-{percentSale}%</span>
        </div>
        <CardBody>
          <h5 className="tour_title">
            <Link to={`/tours/${tourCode}`}>{name}</Link>
          </h5>
          Thời gian đi: <span style={{fontWeight: 500}}>{durationTour}</span>
          <div className="unfixedPrice" style={{fontSize: "1rem"}}>{formatPrice(price)} VNĐ/người</div>
          <div className="card_bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              {formatPrice(price - (price * percentSale / 100))} <span style={{fontSize: "1rem"}}> VNĐ/người</span>
            </h5>
            <button className="btn booking_btn">
              <Link to={`/tours/${tourCode}`}>Đặt ngay</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCardOnSale;
