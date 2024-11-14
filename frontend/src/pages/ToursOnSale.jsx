import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tours.css";
import SearchBar from "./../shared/SearchBar";
import Newsletter from "./../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import TourCardOnSale from "../shared/TourCardOnSale";

const ToursOnSale = () => {

  // Config page
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  useEffect(() => {
    const pages = Math.ceil(5 / 4);
    setPageCount(pages);
  }, [page]);

  const [toursOnSale, setToursOnSale] = useState([]);
  useEffect(() => {
    const fetchAllTours = async () => {
      try {
        const response = await fetch('http://localhost:8080/tours');
        const data = await response.json();
        const saleTours = data.result.filter(tour => tour.saleTour === true);
        setToursOnSale(saleTours);
      } catch (error) {
        console.error('Error fetching all tours:', error);
      }
    };

    fetchAllTours();
  }, []);


  return (
    <>
      <div className="commonSec">
        <CommonSection className="commonSec" title={"Ưu đãi đặc biệt"} />
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
            {toursOnSale?.map((tour) => (
              <Col lg="3" className="mb-4" key={tour.tourCode}>
                <TourCardOnSale tour={tour} />
              </Col>
            ))}
            <Col lg="12">
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {[...Array(pageCount).keys()].map((number) => (
                  <span
                    key={number}
                    onClick={() => setPage(number)}
                    className={page === number ? "active__page" : ""}
                  >
                    {number + 1}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default ToursOnSale;
