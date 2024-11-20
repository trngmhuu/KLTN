import React, { useState, useEffect, useCallback } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/search-booking-list.css";
import SearchBar from "./../shared/SearchBar";
import Newsletter from "./../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";

const SearchBookingList = () => {

  return (
    <>
      <div className="commonSec">
        <CommonSection className="commonSec" title={"Tra cứu thông tin đặt tour"} />
      </div>
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          <Row>
            {/* {tours?.map((tour) => (
              <Col lg="3" className="mb-4" key={tour.tourCode}>
                <TourCard tour={tour} />
              </Col>
            ))} */}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default SearchBookingList;
