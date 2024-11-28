import React, { useState, useEffect, useCallback } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tours.css";
import TourCard from "./../shared/TourCard";
import SearchBar from "./../shared/SearchBar";
import Newsletter from "./../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";

const Tours = () => {
  const tourtypename = useParams();
  const [tours, setTours] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  
  const itemsPerPage = 8; // Hiển thị 8 item mỗi trang

  // Lấy dữ liệu các tour
  const fetchTour = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/tours/by-typetourname/${tourtypename.tourtypename}`, {
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
      setTours(data.result);

    } catch (error) {
      console.error('Error fetching tour:', error);
    }
  }, [tourtypename]);

  useEffect(() => {
    if (tourtypename) { // Chỉ gọi API khi có tourType
      fetchTour();
    }
  }, [tourtypename, fetchTour]);

  useEffect(() => {
    const pages = Math.ceil(tours.length / itemsPerPage); // Tính số trang
    setPageCount(pages);
  }, [tours]);

  // Cắt tours theo trang hiện tại
  const paginatedTours = tours.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <>
      <div className="commonSec">
        <CommonSection className="commonSec" title={tourtypename.tourtypename} />
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
            {paginatedTours?.map((tour) => (
              <Col lg="3" className="mb-4" key={tour.tourCode}>
                <TourCard tour={tour} />
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

export default Tours;
