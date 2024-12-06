import React, { useState } from 'react'
import "./search-bar.css"
import { Col, Form, FormGroup } from "reactstrap"
import cities from "../assets/data/cities.json"
import { useNavigate } from "react-router-dom"

const SearchBarDomesticTours = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        locationStart: '',
        name: '',
        durationTour: ''
    });

    const handleSearch = async () => {
        try {
            const queryParams = new URLSearchParams(searchParams).toString();
            const response = await fetch(`https://tourwebbe.onrender.com/tours/searchTourTypeId1?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.result); 
                
                navigate("/tours/domestic", { state: { searchResults: result.result } });
            } else {
                throw new Error('Không thể lấy dữ liệu người dùng');
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };



    return <Col lg="12">
        <div className="search__bar">
            <Form className="d-flex align-items-center gap-4">
                <FormGroup className="d-flex gap-3 form__group form__group-fast">
                    <span><i class="ri-map-pin-line"></i></span>
                    <div>
                        <h6>Bạn đi từ đâu</h6>
                        <select
                            id='locationStart'
                            value={searchParams.locationStart}
                            onChange={(e) => setSearchParams({ ...searchParams, locationStart: e.target.value })}
                        >
                            <option value="">Tất cả điểm khởi hành</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </FormGroup>
                <FormGroup className="d-flex gap-3 form__group form__group-last">
                    <span><i class="ri-map-pin-line"></i></span>
                    <div>
                        <h6>Bạn muốn đi đâu</h6>
                        <select
                            id='name'
                            value={searchParams.name}
                            onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                        >
                            <option value="">Tất cả điểm đến</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </FormGroup>
                <FormGroup className="d-flex gap-3 form__group form__group-fast">
                    <span><i class="ri-calendar-line"></i></span>
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
                    <i class="ri-search-line"></i>
                </span>
            </Form>
        </div>
    </Col>
}

export default SearchBarDomesticTours