import React from "react";
import ServiceCard from "./ServiceCard";
import { Col } from "reactstrap";

import mapImg from "../assets/images/map-2-line.png";
import userImg from "../assets/images/user-line.png";
import serviceImg from "../assets/images/service-line.png";

const servicesData = [
  {
    imgUrl: mapImg,
    title: "Lịch trình hấp dẫn",
    desc: "Gói tour chất lượng với lịch trình hấp dẫn, đa dạng các điểm tham quan.",
  },
  {
    imgUrl: userImg,
    title: "Hướng dẫn viên kinh nghiệm",
    desc: "Đội ngũ hướng dẫn viên được đào tạo bài bản, có nhiều kinh nghiệm.",
  },
  {
    imgUrl: serviceImg,
    title: "Dịch vụ chất lượng",
    desc: "Dịch vụ ăn uống - ngủ nghỉ đầy đủ, chất lượng đã bao gồm trong gói tour.",
  },
];

const ServiceList = () => {
  return (
    <>
      {servicesData.map((item, index) => (
        <Col lg="3" key={index}>
          <ServiceCard item={item} />
        </Col>
      ))}
    </>
  );
};

export default ServiceList;
