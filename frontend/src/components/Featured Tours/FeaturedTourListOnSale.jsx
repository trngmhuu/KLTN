import React from "react";
import TourCardOnSale from "../../shared/TourCardOnSale";
import { Col } from "reactstrap";

const FeaturedTourListOnSale = ({ tours }) => {
  // Kiểm tra nếu không có tour nào được truyền vào
  if (!tours || tours.length === 0) {
    return (
      <Col lg="12">
        <div className="text-center">Không có tour nào được hiển thị.</div>
      </Col>
    );
  }

  // Lấy tối đa 8 tour đầu tiên
  const featuredTours = tours.slice(0, Math.min(8, tours.length));

  return (
    <>
      {featuredTours.map((tour) => (
        <Col lg="3" className="mb-4" key={tour.idAsString}>
          <TourCardOnSale tour={tour} />
        </Col>
      ))}
    </>
  );
};

export default FeaturedTourListOnSale;