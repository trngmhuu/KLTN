import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tours.css";
import TourCard from "./../shared/TourCard";
import SearchBar from "./../shared/SearchBar";
import Newsletter from "./../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";

const DomesticTours = () => {
    // Config số trang
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    useEffect(() => {
        const pages = Math.ceil(5 / 4);
        setPageCount(pages);
    }, [page]);

    // Lấy danh sách tour trong nước
    const [domesticTours, setDomesticTours] = useState([]);
    useEffect(() => {
        const fetchDomesticTours = async () => {
            try {
                const response = await fetch('http://localhost:8080/tours/by-type/1');
                const data = await response.json();
                setDomesticTours(data.result);
            } catch (error) {
                console.error('Error fetching domestic tours:', error);
            }
        };

        fetchDomesticTours();
    }, []);

    return (
        <>
            <div className="commonSecDomestic">
                <CommonSection title={"Tour trong nước"} />
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
                        {domesticTours?.map((tour) => (
                            <Col lg="3" className="mb-4" key={tour.id}>
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

export default DomesticTours;
