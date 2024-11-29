import React, { useState } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tours.css";
import TourCard from "./../shared/TourCard";
import SearchBar from "./../shared/SearchBar";
import Newsletter from "./../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import { useLocation } from "react-router-dom";

const SearchResultList = () => {
  // Lấy dữ liệu từ state qua useLocation
  const location = useLocation();
  const searchResults = location.state?.searchResults || []; // Nếu không có dữ liệu, fallback là mảng rỗng

  // Phân trang
  const [page, setPage] = useState(0);
  const itemsPerPage = 8; // Số tour hiển thị mỗi trang
  const pageCount = Math.ceil(searchResults.length / itemsPerPage);

  // Lọc tour theo trang hiện tại
  const paginatedTours = searchResults.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <>
      <div className="commonSec">
        <CommonSection className="commonSec" title={"Kết quả tìm kiếm"} />
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
            {paginatedTours.length > 0 ? (
              paginatedTours.map((tour) => (
                <Col lg="3" className="mb-4" key={tour.tourCode}>
                  <TourCard tour={tour} />
                </Col>
              ))
            ) : (
              <Col lg="12">
                <h4 className="text-center">Không tìm thấy kết quả phù hợp.</h4>
              </Col>
            )}
            {searchResults.length > itemsPerPage && (
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
            )}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default SearchResultList;