import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tours.css";
import TourCard from "./../shared/TourCard";
import SearchBarInternational from "./../shared/SearchBarInternationalTours";
import Newsletter from "./../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import { useLocation } from "react-router-dom";

const InternationalTours = () => {
    const location = useLocation();
    const searchResults = location.state?.searchResults || []; // Nếu không có dữ liệu, fallback là mảng rỗng

    // Lấy danh sách tour nước ngoài
    const [internationalTours, setInternationalTours] = useState([]);
    useEffect(() => {
        const fetchInternationalTours = async () => {
            try {
                const response = await fetch("https://tourwebbe.onrender.com/tours/by-type/2");
                const data = await response.json();
                setInternationalTours(data.result);
            } catch (error) {
                console.error("Error fetching international tours:", error);
            }
        };

        fetchInternationalTours();
    }, []);

    // Config số trang
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const [toursToDisplay, setToursToDisplay] = useState([]); // Dữ liệu để hiển thị
    const itemsPerPage = 8; // Hiển thị 8 item mỗi trang

    // Cập nhật danh sách hiển thị và số trang mỗi khi `searchResults` hoặc `internationalTours` thay đổi
    useEffect(() => {
        const currentTours = searchResults.length > 0 ? searchResults : internationalTours;
        setToursToDisplay(currentTours);
    
        // Cập nhật số trang
        const pages = Math.ceil(currentTours.length / itemsPerPage);
        setPageCount(pages);
    }, [searchResults, internationalTours]);
    
    useEffect(() => {
        // Không reset trang khi chỉ đổi `page`
        console.log("Page updated:", page);
    }, [page]);

    // Lấy dữ liệu của trang hiện tại
    const paginatedTours = toursToDisplay.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return (
        <>
            <div className="commonSecInternational">
                <CommonSection title={"Tour nước ngoài"} />
            </div>
            <section>
                <Container>
                    <Row>
                        <SearchBarInternational />
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
                                        onClick={() => {
                                            setPage(number);
                                            console.log("Page changed to:", number); // Debug
                                        }}
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
