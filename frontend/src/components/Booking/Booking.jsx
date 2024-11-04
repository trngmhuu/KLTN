import React, { useState } from "react";
import "./booking.css";
import {
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
import districtData from "../../assets/data/districtData.json"
import cities from "../../assets/data/cities.json"
import { useNavigate } from "react-router-dom";

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

const Booking = ({ tour }) => {
  const { price, isActive, tourCode } = tour;
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    customerName: "",
    customerEmail: "",
    customerPhoneNumber: "",
    customerCity: "",
    customerDistric: "",
    customerAddress: "",
    numberOfCustomer: 1,
    bookingDate: "",
    note: "",
    totalMoney: "",
    typePay: "",
    tourCode,
    isPay: ""
  });
  const [selectedCity, setSelectedCity] = useState("Thành phố Hồ Chí Minh");
  const [districts, setDistricts] = useState(districtData[selectedCity] || []);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setDistricts(districtData[city] || []);
    setSelectedDistrict(""); // Xóa lựa chọn quận/huyện hiện tại khi thay đổi thành phố
  };

  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: id === "numberOfCustomer" ? Number(value) : value,
    }));
  };
  const totalAmount = Number(price) * Number(credentials.numberOfCustomer);

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/thank-you");
  };

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          {formatPrice(price)} <span>VNĐ/người</span>
        </h3>
      </div>

      <div className="booking__form">
        <h5>Thông tin đăng ký</h5>
        <Form className="booing__info-form" onSubmit={handleClick}>
          {/* Họ tên */}
          <FormGroup className="d-flex align-items-center gap-3">
            <input
              type="text"
              placeholder="Họ tên"
              id="fullName"
              onChange={handleChange}
            />
            <span style={{ color: "red", marginTop: "5px" }}>(*)</span>
          </FormGroup>

          {/* Số điện thoại */}
          <FormGroup className="d-flex align-items-center gap-3">
            <input
              type="text"
              placeholder="Số điện thoại"
              id="phoneNumber"
              onChange={handleChange}
            />
            <span style={{ color: "red", marginTop: "5px" }}>(*)</span>
          </FormGroup>

          {/* Email */}
          <FormGroup>
            <input
              type="text"
              placeholder="Email"
              id="email"
              onChange={handleChange}
            />
          </FormGroup>

          {/* Chọn tỉnh thành, quận huyện */}
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Địa chỉ:</span>
          <FormGroup className="d-flex align-items-center gap-3">
            <select id="city" onChange={handleCityChange} className="selCity mt-2" value={selectedCity}>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>

            <select
              id="district"
              onChange={(e) => setSelectedDistrict(e.target.value)}
              value={selectedDistrict}
              className="selDistrict mt-2"
            >
              {districts.map((district, index) => (
                <option key={index} value={district}>{district}</option>
              ))}
            </select>
          </FormGroup>


          <FormGroup className="d-flex align-items-center gap-3">
            <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Ngày đi dự kiến:</span>
            <input
              type="date"
              placeholder="Ngày đi"
              id="bookingDate"
              required
              onChange={handleChange}
            />
          </FormGroup>

          {/* Số lượng hành khách */}
          <FormGroup className="d-flex align-items-center gap-3">
            <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Số lượng hành khách:</span>
            <input
              type="text"
              placeholder="Số người đi"
              id="numberOfCustomer"
              required
              defaultValue="1"
              onChange={handleChange}
              style={{ textAlign: "center" }}
            />
          </FormGroup>

          {/* Phương thức thanh toán */}
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Chọn hình thức thanh toán:</span>
          <FormGroup className="d-flex align-items-center gap-3 mt-2">
            <input
              type="radio"
              name="paymentMethod"
              id="radCash"
              value="Tiền mặt"
              checked={paymentMethod === "Tiền mặt"}
              onChange={() => setPaymentMethod("Tiền mặt")}
            />
            <span style={{ whiteSpace: "nowrap" }}>Tiền mặt</span>

            <input
              type="radio"
              name="paymentMethod"
              id="radBankingOnline"
              value="Chuyển khoản"
              checked={paymentMethod === "Chuyển khoản"}
              onChange={() => setPaymentMethod("Chuyển khoản")}
            />
            <span style={{ whiteSpace: "nowrap" }}>Chuyển khoản</span>
          </FormGroup>

          {/* Nội dung hiển thị điều kiện */}
          {paymentMethod === "Tiền mặt" && (
            <p style={{ textAlign: "justify" }}>
              Quý khách vui lòng đến trực tiếp tại bất kỳ văn phòng HTravel trên toàn quốc để thực hiện việc thanh toán. <a href="">Xem chi tiết</a>
            </p>
          )}
          {paymentMethod === "Chuyển khoản" && (
            <p style={{ textAlign: "justify" }}>
              Quý khách sau khi thực hiện việc chuyển khoản,
              vui lòng gửi email đính kèm hóa đơn chuyển khoản đến <b>minhhuu0705@gmail.com </b>
              hoặc gọi số <b>0123456789</b> để được nhân viên xác nhận.
              <br />
              ----------------<br />
              Tên tài khoản: Trương Minh Hữu<br />
              Số tài khoản: <b>79797979</b><br />
              Ngân hàng: MB Bank - Chi nhánh Bình Thạnh<br />
              ----------------
            </p>
          )}

          {/* Ghi chú */}
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Ghi chú:</span>
          <FormGroup className="d-flex align-items-center gap-3 mt-2">
            <textarea name="" id="txtNote" style={{ height: "200px", width: "100%", padding: "10px" }} />
          </FormGroup>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              {formatPrice(price)}
              <i className="ri-close-line"></i> {credentials.numberOfCustomer} người
            </h5>
            <span>{formatPrice(price * credentials.numberOfCustomer)}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Tổng cộng</h5>
            <span>{formatPrice(totalAmount)} VNĐ</span>
          </ListGroupItem>
        </ListGroup>
        <Button
          className="btn primary__btn w-100 mt-4"
          onClick={handleClick}
          disabled={!isActive}
        >
          Đặt tour
        </Button>
      </div>
    </div>
  );
};

export default Booking;
