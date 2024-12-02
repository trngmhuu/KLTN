import React, { useRef, useState, useEffect } from "react";
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
import { useNotifications } from '../../context/NotificationContext';

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

const Booking = ({ tour }) => {
  const { addNotification } = useNotifications();
  const { price, isActive, tourCode, saleTour, percentSale } = tour;
  const [loading, setLoading] = useState(false);

  const displayedPrice = saleTour ? price - (price * percentSale / 100) : price;

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

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    if (!couponCode) {
      setCoupon(null); // Xóa thông tin mã giảm giá nếu ô nhập trống
    }
  }, [couponCode]);

  const handleCouponCheck = async () => {
    if (!couponCode) {
      toast.error("Vui lòng nhập mã giảm giá.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/coupons/by-codecoupon/${couponCode}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCoupon(result.result);
        toast.success("Mã giảm giá hợp lệ!");
      } else {
        toast.error("Mã giảm giá không hợp lệ.");
      }
    } catch (error) {
      console.error("Error checking coupon:", error);
      toast.error("Lỗi kết nối. Vui lòng thử lại.");
    }
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

  const totalAmount = coupon && coupon.activeCoupon
    ? displayedPrice * (1 - coupon.discount / 100) * Number(credentials.numberOfCustomer)
    : displayedPrice * Number(credentials.numberOfCustomer);

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
    setLoading(true);

    try {
      const today = formatDate(new Date());  // Định dạng ngày hiện tại
      const expectedDeparture = formatDate(credentials.expectedDate); // Định dạng ngày đi dự kiến

      // Đầu tiên, gửi yêu cầu POST đến API /customers để lưu thông tin khách hàng
      const customerResponse = await fetch("http://localhost:8080/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: credentials.customerName,
          customerEmail: credentials.customerEmail,
          customerPhoneNumber: credentials.customerPhoneNumber,
          customerCity: selectedCity,
          customerDistrict: selectedDistrict,
          customerAddress: credentials.customerAddress,
        }),
      });

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
        const bookingData = await responseBooking.json();
        addNotification(`Một khách hàng đã đặt tour ${tourCode} với mã booking ${bookingData.result.bookingCode}`);
        setLoading(false);
        // Truyền dữ liệu booking qua navigate
        navigate("/thank-you", { state: { bookingData: bookingData.result } });
      } else {
        setLoading(false);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
      }
    } catch (error) {
      setLoading(false);
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
          {formatPrice(displayedPrice)} <span>VNĐ/người</span>
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

          {/* Nội dung của các hình thức thanh toán */}
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
            <textarea
              id="note"
              style={{ height: "200px", width: "100%", padding: "10px" }}
              onChange={handleChange}
            />
          </FormGroup>

          {/* Mã giảm giá */}
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Mã giảm giá:</span>
          <FormGroup className="d-flex align-items-center gap-3 mt-2">
            <input
              placeholder="Nhập mã giảm giá (nếu có)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}  // Cập nhật giá trị mã giảm giá
            />
          </FormGroup>
          <Button
            className="btn primary__btn w-100"
            onClick={handleCouponCheck}
            disabled={!isActive || loading} // Vô hiệu hóa nút khi đang loading
          >
            Kiểm tra mã giảm giá
          </Button>
          {/* Hiển thị thông tin coupon nếu có */}
          {coupon && coupon.activeCoupon && (
            <div className="coupon-info mt-3">
              <h6>Mã giảm giá: <b>{coupon.codeCoupon}</b></h6>
              <p>Giảm giá: <b>{coupon.discount}%</b></p>
              <p style={{ color: "green", fontWeight: "bold", fontStyle: "italic" }}>Mã giảm giá này vẫn còn hiệu lực! Bạn đã tiết kiệm được: {formatPrice(displayedPrice * coupon.discount / 100 * credentials.numberOfCustomer)} VNĐ</p>

            </div>
          )}

          {coupon && !coupon.activeCoupon && (
            <p style={{ color: "red" }}>Mã giảm giá này không còn hiệu lực.</p>
          )}
        </Form>

      </div>

      <div className="booking__bottom">
        {loading && (
          <div className="loading-spinner">
            <i class="ri-restart-line"></i>
          </div>
        )}
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              {formatPrice(displayedPrice)}
              <i className="ri-close-line"></i> {credentials.numberOfCustomer} người
            </h5>
            <span>{formatPrice(displayedPrice * credentials.numberOfCustomer)}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Tổng cộng</h5>
            <span>{formatPrice(totalAmount)} VNĐ</span>
          </ListGroupItem>
        </ListGroup>
        <Button
          className="btn primary__btn w-100 mt-4"
          onClick={handleClick}
          disabled={!isActive || loading} // Vô hiệu hóa nút khi đang loading
        >
          Đặt tour
        </Button>
      </div>

    </div>
  );
};

export default Booking;