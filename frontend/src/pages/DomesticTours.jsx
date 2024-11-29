import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tours.css";
import TourCard from "./../shared/TourCard";
import SearchBarDomestic from "./../shared/SearchBarDomesticTours";
import Newsletter from "./../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import { useLocation } from "react-router-dom";

const DomesticTours = () => {
    // Lấy dữ liệu từ state qua useLocation
    const location = useLocation();
    const searchResults = location.state?.searchResults || []; // Nếu không có dữ liệu, fallback là mảng rỗng

    // Lấy danh sách tour trong nước
    const [domesticTours, setDomesticTours] = useState([]);
    useEffect(() => {
        const fetchDomesticTours = async () => {
            try {
                const response = await fetch("http://localhost:8080/tours/by-type/1");
                const data = await response.json();
                setDomesticTours(data.result);
            } catch (error) {
                console.error("Error fetching domestic tours:", error);
            }
        };

        fetchDomesticTours();
    }, []);

    // Config số trang
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const [toursToDisplay, setToursToDisplay] = useState([]); // Dữ liệu để hiển thị
    const itemsPerPage = 8; // Hiển thị 8 item mỗi trang

    // Cập nhật danh sách hiển thị và số trang mỗi khi `searchResults` hoặc `domesticTours` thay đổi
    useEffect(() => {
        const currentTours = searchResults.length > 0 ? searchResults : domesticTours;
        setToursToDisplay(currentTours);

        // Tính toán số trang
        const pages = Math.ceil(currentTours.length / itemsPerPage);
        setPageCount(pages);

        // Reset về trang đầu
        setPage(0);
    }, [searchResults, domesticTours]);

    // Lấy dữ liệu của trang hiện tại
    const paginatedTours = toursToDisplay.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return (
        <>
            <div className="commonSecDomestic">
                <CommonSection title={"Tour trong nước"} />
            </div>
            <section>
                <Container>
                    <Row>
                        <SearchBarDomestic />
                    </Row>
                </Container>
            </section>
            <section className="pt-0">
                <Container>
                    <Row>
                        {paginatedTours?.map((tour) => (
                            <Col lg="3" className="mb-4" key={tour.id}>
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

export default DomesticTours;
