import React, { useRef, useState } from "react";
import "./booking.css";
import {
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
import districtData from "../../assets/data/districtData.json";
import cities from "../../assets/data/cities.json";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

const Booking = ({ tour }) => {
  const { price, isActive, tourCode } = tour;
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const dateRef = useRef(null);
  const customersRef = useRef(null);

  const [credentials, setCredentials] = useState({
    customerName: "",
    customerEmail: "",
    customerPhoneNumber: "",
    customerCity: "",
    customerDistric: "",
    customerAddress: "",
    numberOfCustomer: 1,
    bookingDate: "",
    expectedDate: "",
    note: "",
    totalMoney: "",
    typePay: "",
    tourCode,
    isPay: ""
  });
  const [selectedCity, setSelectedCity] = useState("Thành phố Hồ Chí Minh");
  const [districts, setDistricts] = useState(districtData[selectedCity] || []);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setDistricts(districtData[city] || []);
    setSelectedDistrict("");
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "numberOfCustomer") {
      // Kiểm tra nếu trường là số lượng hành khách
      const numValue = parseInt(value) || 0; // Chuyển đổi sang số, nếu không hợp lệ thì là 0
      setCredentials(prev => ({
        ...prev,
        [id]: numValue,
      }));
    } else {
      setCredentials(prev => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const totalAmount = Number(price) * Number(credentials.numberOfCustomer);

  const validateFields = () => {
    const { customerName, customerEmail, customerPhoneNumber, expectedDate, numberOfCustomer } = credentials;

    // Kiểm tra họ tên
    const nameRegex = /^[^\d!@#$%^&*()_+={}[\]:;"'<>,.?~`]+$/;
    if (!customerName || !nameRegex.test(customerName)) {
      toast.error("Họ tên không được để trống và không được chứa số hoặc ký tự đặc biệt.");
      nameRef.current?.focus();
      return false;
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^(0[3|5|7|8|9]\d{8})$/;
    if (!customerPhoneNumber || !phoneRegex.test(customerPhoneNumber)) {
      toast.error("Số điện thoại không hợp lệ.");
      phoneRef.current?.focus();
      return false;
    }

    // Kiểm tra email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!customerEmail || !emailRegex.test(customerEmail)) {
      toast.error("Email không hợp lệ.");
      emailRef.current?.focus();
      return false;
    }

    // Kiểm tra ngày đi dự kiến
    const currentDate = new Date();
    const selectedDate = new Date(expectedDate);
    if (!expectedDate || selectedDate <= currentDate) {
      toast.error("Ngày đi dự kiến phải chọn ngày cụ thể và sau ngày hiện tại.");
      dateRef.current?.focus();
      return false;
    }

    // Kiểm tra số lượng khách
    if (!numberOfCustomer || numberOfCustomer <= 0) {
      toast.error("Số lượng hành khách phải lớn hơn 0");
      customersRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const today = formatDate(new Date());  // Định dạng ngày hiện tại
      const expectedDeparture = formatDate(credentials.expectedDate); // Định dạng ngày đi dự kiến

      const responseBooking = await fetch("http://localhost:8080/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...credentials,
          bookingDate: today,
          expectedDate: expectedDeparture,
          customerCity: selectedCity,
          customerDistrict: selectedDistrict,
          totalMoney: totalAmount,
          typePay: paymentMethod,
          isPay: false,
        }),
      });

      if (responseBooking.ok) {
        navigate("/thank-you");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối. Vui lòng thử lại sau!");
    }
  };


  return (
    <div className="booking">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          {formatPrice(price)} <span>VNĐ/người</span>
        </h3>
      </div>

      <div className="booking__form">
        <h5>Thông tin đăng ký</h5>
        <Form className="booking__info-form" onSubmit={handleClick}>
          {/* Họ tên */}
          <FormGroup className="d-flex align-items-center gap-3">
            <input
              type="text"
              placeholder="Họ tên"
              id="customerName"
              onChange={handleChange}
              ref={nameRef}
            />
            <span style={{ color: "red", marginTop: "5px" }}>(*)</span>
          </FormGroup>

          {/* Số điện thoại */}
          <FormGroup className="d-flex align-items-center gap-3">
            <input
              type="text"
              placeholder="Số điện thoại"
              id="customerPhoneNumber"
              onChange={handleChange}
              ref={phoneRef}
            />
            <span style={{ color: "red", marginTop: "5px" }}>(*)</span>
          </FormGroup>

          {/* Email */}
          <FormGroup>
            <input
              type="text"
              placeholder="Email"
              id="customerEmail"
              onChange={handleChange}
              ref={emailRef}
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

          {/* Nhập địa chỉ cụ thể */}
          <FormGroup>
            <input
              type="text"
              placeholder="Địa chỉ cụ thể"
              id="customerAddress"
              onChange={handleChange}
            />
          </FormGroup>

          {/* Chọn ngày đi */}
          <FormGroup className="d-flex align-items-center gap-3">
            <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Ngày đi dự kiến:</span>
            <input
              type="date"
              placeholder="Ngày đi"
              id="expectedDate"
              required
              onChange={handleChange}
              ref={dateRef}
            />
            <span style={{ color: "red", marginTop: "5px" }}>(*)</span>
          </FormGroup>

          {/* Số lượng hành khách */}
          <FormGroup className="d-flex align-items-center gap-3">
            <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Số lượng hành khách:</span>
            <input
              type="number"
              placeholder="Số người đi"
              id="numberOfCustomer"
              required
              value={credentials.numberOfCustomer} 
              onChange={handleChange}
              style={{ textAlign: "center" }}
              min="1"  // Đặt giá trị tối thiểu là 1
              ref={customersRef}
            />
            <span style={{ color: "red", marginTop: "5px" }}>(*)</span>
          </FormGroup>

          {/* Hình thức thanh toán */}
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

          {/* Payment method content */}
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

          {/* Note section */}
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Ghi chú:</span>
          <FormGroup className="d-flex align-items-center gap-3 mt-2">
            <textarea
              id="note"
              style={{ height: "200px", width: "100%", padding: "10px" }}
              onChange={handleChange}
            />
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