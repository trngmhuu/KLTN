import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tours.css";
import TourCard from "./../shared/TourCard";
import SearchBar from "./../shared/SearchBar";
import Newsletter from "./../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";

const InternationalTours = () => {
    // Config số trang
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    useEffect(() => {
        const pages = Math.ceil(5 / 4);
        setPageCount(pages);
    }, [page]);

    // Lấy danh sách tour trong nước
    const [internationalTours, setInternationalTours] = useState([]);
    useEffect(() => {
        const fetchInternationalTours = async () => {
            try {
                const response = await fetch('http://localhost:8080/tours/by-type/2');
                const data = await response.json();
                setInternationalTours(data.result);
            } catch (error) {
                console.error('Error fetching international tours:', error);
            }
        };

        fetchInternationalTours();
    }, []);

    return (
        <>
            <div className="commonSecInternational">
                <CommonSection title={"Tour nước ngoài"} />
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
                        {internationalTours?.map((tour) => (
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

export default InternationalTours;
