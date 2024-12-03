import React, { useState } from 'react';
import "./search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import cities from "../assets/data/cities.json";
import countries from "../assets/data/countries.json";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const navigate = useNavigate();
    const [travelType, setTravelType] = useState("Du lịch trong nước");
    const [searchParams, setSearchParams] = useState({
        locationStart: '',
        name: '',
        durationTour: ''
    });

    const handleSearch = async () => {
        try {
            const queryParams = new URLSearchParams(searchParams).toString();
            const apiUrl = travelType === "Du lịch trong nước"
                ? `http://localhost:8080/tours/searchTourTypeId1?${queryParams}`
                : `http://localhost:8080/tours/searchTourTypeId2?${queryParams}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.result); // Kiểm tra dữ liệu trả về từ API

                // Chuyển hướng đến SearchResultList với dữ liệu
                navigate("/searchTours", { state: { searchResults: result.result } });
            } else {
                throw new Error('Không thể lấy dữ liệu người dùng');
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    const handleTravelTypeChange = (e) => {
        const value = e.target.value;
    
        // Cập nhật loại hình du lịch và reset các trường tìm kiếm
        setTravelType(value);
        setSearchParams({
            locationStart: '',
            name: '',
            durationTour: ''
        });
    };
    

    const travelOptions = travelType === "Du lịch trong nước" ? cities : countries;

    return (
        <Col lg="12">
            <div className="search__bar">
                <Form className="d-flex align-items-center gap-4">
                    {/* Trường chọn loại hình du lịch */}
                    <FormGroup className="d-flex gap-3 form__group form__group-fast">
                        <span><i className="ri-earth-line"></i></span>
                        <div>
                            <h6>Loại hình du lịch</h6>
                            <select
                                id="travelType"
                                value={travelType}
                                onChange={handleTravelTypeChange}
                            >
                                <option value="Du lịch trong nước">Du lịch trong nước</option>
                                <option value="Du lịch nước ngoài">Du lịch nước ngoài</option>
                            </select>

                        </div>
                    </FormGroup>

                    {/* Hiển thị locationStart chỉ khi là du lịch trong nước */}
                    {travelType === "Du lịch trong nước" && (
                        <FormGroup className="d-flex gap-3 form__group form__group-fast">
                            <span><i className="ri-map-pin-line"></i></span>
                            <div>
                                <h6>Bạn đi từ đâu</h6>
                                <select
                                    id="locationStart"
                                    value={searchParams.locationStart}
                                    onChange={(e) =>
                                        setSearchParams({ ...searchParams, locationStart: e.target.value })
                                    }
                                >
                                    <option value="">Tất cả điểm khởi hành</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </FormGroup>
                    )}

                    {/* Trường name */}
                    <FormGroup className="d-flex gap-3 form__group form__group-last">
                        <span><i className="ri-map-pin-line"></i></span>
                        <div>
                            <h6>Bạn muốn đi đâu</h6>
                            <select
                                id='name'
                                value={searchParams.name}
                                onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                            >
                                <option value="">Tất cả điểm đến</option>
                                {travelOptions.map((location, index) => (
                                    <option key={index} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>
                    </FormGroup>

                    {/* Trường durationTour */}
                    <FormGroup className="d-flex gap-3 form__group form__group-fast">
                        <span><i className="ri-calendar-line"></i></span>
                        <div>
                            <h6>Thời gian đi</h6>
                            <select
                                id='selectDurationTour'
                                value={searchParams.durationTour}
                                onChange={(e) => setSearchParams({ ...searchParams, durationTour: e.target.value })}
                            >
                                <option value="">Tất cả thời gian</option>
                                <option value="1 ngày">1 ngày</option>
                                <option value="2 ngày 1 đêm">2 ngày 1 đêm</option>
                                <option value="3 ngày 2 đêm">3 ngày 2 đêm</option>
                                <option value="4 ngày 3 đêm">4 ngày 3 đêm</option>
                                <option value="5 ngày 4 đêm">5 ngày 4 đêm</option>
                            </select>
                        </div>
                    </FormGroup>

                    <span className="search__icon" onClick={handleSearch}>
                        <i className="ri-search-line"></i>
                    </span>
                </Form>
            </div>
        </Col>
    );
}

export default SearchBar;
