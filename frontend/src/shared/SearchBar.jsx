import React, { useRef } from 'react'
import "./search-bar.css"
import { Col, Form, FormGroup } from "reactstrap"

const SearchBar = () => {

    const locationRef = useRef("");
    const distanceRef = useRef(0);
    const maxGroupSizeRef = useRef(0);
    const searchHandler = () => {
        const location = locationRef.current.value
        const distance = distanceRef.current.value
        const maxGroupSize = maxGroupSizeRef.current.value

        if (location === "" || distance === "" || maxGroupSize === "") {
            return alert("Vui lòng nhập tất cả các trường");
        }
    }

    return <Col lg="12">
        <div className="search__bar">
            <Form className="d-flex align-items-center gap-4">
                <FormGroup className="d-flex gap-3 form__group form__group-fast">
                    <span><i class="ri-map-pin-line"></i></span>
                    <div>
                        <h6>Địa điểm</h6>
                        <input type="text" placeholder="Bạn muốn đi đâu?" ref={locationRef} />
                    </div>
                </FormGroup>
                <FormGroup className="d-flex gap-3 form__group form__group-fast">
                    <span><i class="ri-calendar-line"></i></span>
                    <div>
                        <h6>Thời gian đi</h6>
                        <select id='durationTour'>
                            <option value="1 ngày" selected>1 ngày</option>
                            <option value="2 ngày 1 đêm">2 ngày 1 đêm</option>
                            <option value="3 ngày 2 đêm">3 ngày 2 đêm</option>
                            <option value="4 ngày 3 đêm">4 ngày 3 đêm</option>
                            <option value="5 ngày 4 đêm">5 ngày 4 đêm</option>
                        </select>
                    </div>
                </FormGroup>
                <FormGroup className="d-flex gap-3 form__group form__group-last">
                    <span><i class="ri-group-line"></i></span>
                    <div>
                        <h6>Mức giá</h6>
                        <input type="text" placeholder='0' />
                    </div>
                </FormGroup>
                <span className="search__icon" type="submit" onClick={searchHandler}>
                    <i class="ri-search-line"></i>
                </span>
            </Form>
        </div>
    </Col>
}

export default SearchBar