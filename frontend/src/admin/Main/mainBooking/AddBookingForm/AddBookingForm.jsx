import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  DatePicker,
  Select,
  Row,
  Col,
} from "antd";
import "./addBookingForm.css";
import moment from "moment";
import cities from "../../../../assets/data/cities.json";
import districts from "../../../../assets/data/districtData.json";
import { useNotifications } from "../../../../context/NotificationContext";

const { Option } = Select;

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

function AddBookingForm({ changeComponent }) {
  const { addNotification } = useNotifications();
  const [couponCode, setCouponCode] = useState("");
  const [customers, setCustomers] = useState([]);

  const [booking, setBooking] = useState({
    bookingCode: "",
    customerName: "",
    customerEmail: "",
    customerPhoneNumber: "",
    customerCity: "",
    customerDistrict: "",
    customerAddress: "",
    numberOfCustomer: 1,
    bookingDate: moment().format("DD/MM/YYYY"),
    expectedDate: "",
    note: "",
    tourCode: "",
    typePay: "",
    totalMoney: "",
    payBooking: false,
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/customers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách khách hàng");
        const data = await response.json();
        setCustomers(data.result);
      } catch (error) {
        console.error("Không thể tải danh sách khách hàng:", error);
      }
    };
    fetchCustomers();
  }, []);

  // New method to check and autofill customer details
  const handleCheckCustomer = () => {
    const phoneToCheck = booking.customerPhoneNumber.trim();

    if (!phoneToCheck) {
      message.warning("Vui lòng nhập số điện thoại");
      return;
    }

    // Find customer by phone number
    const matchedCustomer = customers.find(
      (customer) => customer.customerPhoneNumber === phoneToCheck
    );

    if (matchedCustomer) {
      // Autofill customer details
      const filteredDistricts = districts[matchedCustomer.customerCity] || [];

      setBooking((prevBooking) => ({
        ...prevBooking,
        customerName: matchedCustomer.customerName,
        customerEmail: matchedCustomer.customerEmail,
        customerCity: matchedCustomer.customerCity,
        customerDistrict: matchedCustomer.customerDistrict,
        customerAddress: matchedCustomer.customerAddress,
      }));

      // Update available districts for the matched city
      setAvailableDistricts(filteredDistricts);

      message.success("Đã tìm thấy thông tin khách hàng");
    } else {
      message.warning("Không tìm thấy khách hàng với số điện thoại này");
    }
  };

  const [tours, setTours] = useState([]); // State lưu danh sách các tour
  const [selectedTour, setSelectedTour] = useState(null); // State lưu thông tin tour khi chọn
  const inputRefs = useRef({});

  // Lấy danh sách tour
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("http://localhost:8080/tours", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách tour");
        const data = await response.json();

        // Lọc danh sách tour chỉ bao gồm những tour có isActive = true
        const activeTours = data.result.filter((tour) => tour.isActive);
        setTours(activeTours); // Lưu danh sách tour có isActive = true vào state
      } catch (error) {
        message.error("Không thể tải danh sách tour.");
      }
    };
    fetchTours();
  }, []); // Chạy khi component được render lần đầu tiên

  // Hàm để lấy thông tin chi tiết của tour khi người dùng chọn
  const handleTourChange = async (tourCode) => {
    setBooking((prevBooking) => ({
      ...prevBooking,
      tourCode,
    }));

    if (tourCode) {
      try {
        const response = await fetch(
          `http://localhost:8080/tours/by-tourcode/${tourCode}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Lỗi khi lấy thông tin tour");
        const data = await response.json();
        setSelectedTour(data.result); // Lưu thông tin tour vào state
        // Tính lại tổng tiền nếu có giá tour
        if (data.result && data.result.price) {
          setBooking((prevBooking) => ({
            ...prevBooking,
            totalMoney: data.result.price * prevBooking.numberOfCustomer,
          }));
        }
      } catch (error) {
        message.error("Không thể lấy thông tin tour.");
        setSelectedTour(null); // Reset khi có lỗi
      }
    } else {
      setSelectedTour(null); // Reset khi không chọn tour
    }
  };

  // Hàm tính toán tổng tiền khi số lượng khách thay đổi
  const handleNumberOfCustomerChange = (e) => {
    const numberOfCustomer = e.target.value;
    setBooking((prevBooking) => {
      const updatedTotalMoney = selectedTour
        ? selectedTour.price * numberOfCustomer
        : prevBooking.totalMoney;
      return {
        ...prevBooking,
        numberOfCustomer,
        totalMoney: updatedTotalMoney,
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const handleDateChange = (name, date) => {
    setBooking({ ...booking, [name]: date ? date.format("DD-MM-YYYY") : "" });
  };

  const handleSelectChange = (name, value) => {
    setBooking({ ...booking, [name]: value });
  };

  const focusInput = (name) => {
    if (inputRefs.current[name]) {
      inputRefs.current[name].focus();
    }
  };

  const [availableDistricts, setAvailableDistricts] = useState([]);
  const handleCityChange = (city) => {
    setBooking((prevBooking) => ({
      ...prevBooking,
      customerCity: city,
      customerDistrict: "",
    }));
    const filteredDistricts = districts[city] || [];
    setAvailableDistricts(filteredDistricts);
  };

  const handleDistrictChange = (district) => {
    setBooking((prevBooking) => ({
      ...prevBooking,
      customerDistrict: district,
    }));
  };

  const addBooking = async () => {
    if (!booking.customerName.trim()) {
      message.error("Tên khách hàng không được để trống!");
      focusInput("customerName");
      return;
    }

    if (!booking.customerEmail.trim()) {
      message.error("Email khách hàng không được để trống!");
      focusInput("customerEmail");
      return;
    }

    if (!booking.customerPhoneNumber.trim()) {
      message.error("Số điện thoại không được để trống!");
      focusInput("customerPhoneNumber");
      return;
    }

    if (!booking.customerCity.trim()) {
      message.error("Vui lòng chọn Tỉnh/Thành phố!");
      focusInput("customerCity");
      return;
    }

    if (!booking.customerDistrict.trim()) {
      message.error("Vui lòng chọn Quận/Huyện!");
      focusInput("customerDistrict");
      return;
    }

    if (
      booking.numberOfCustomer <= 0 ||
      !Number.isInteger(booking.numberOfCustomer)
    ) {
      message.error("Số lượng khách hàng phải là số nguyên lớn hơn 0!");
      focusInput("numberOfCustomer");
      return;
    }

    if (!booking.tourCode.trim()) {
      message.error("Chưa chọn tour");
      focusInput("tourCode");
      return;
    }

    if (
      !booking.expectedDate ||
      moment(booking.expectedDate, "DD/MM/YYYY").isSameOrBefore(moment(), "day")
    ) {
      message.error("Ngày dự kiến phải được chọn và sau ngày hiện tại!");
      focusInput("expectedDate");
      return;
    }

    if (!booking.typePay.trim()) {
      message.error("Chưa chọn hình thức thanh toán");
      focusInput("typePay");
      return;
    }

    // Chuẩn hóa định dạng ngày thành dd/mm/yyyy
    const formattedBooking = {
      ...booking,
      bookingDate: moment(booking.bookingDate, "DD-MM-YYYY").format(
        "DD/MM/YYYY"
      ),
      expectedDate: moment(booking.expectedDate, "DD-MM-YYYY").format(
        "DD/MM/YYYY"
      ),
    };

    // Thông tin khách hàng
    const customerData = {
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhoneNumber: booking.customerPhoneNumber,
      customerCity: booking.customerCity,
      customerDistrict: booking.customerDistrict,
      customerAddress: booking.customerAddress,
    };

    // Lưu thông tin khách hàng trước
    const customerResponse = await fetch("http://localhost:8080/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/bookings/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formattedBooking),
    });

    if (!response.ok) throw new Error("Lỗi khi thêm booking");
    const bookingData = await response.json();
// Lấy tên người dùng từ localStorage
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const username = userInfo?.username || "Người dùng";

// Kiểm tra và hủy mã giảm giá nếu đã được sử dụng
let notificationMessage = `${username} vừa tạo đơn đặt tour mới với tour ${booking.tourCode}, mã đặt tour là ${bookingData.result.bookingCode}`;

if (isCouponApplied && couponCode) {
  try {
    // Gọi API để hủy mã giảm giá
    const couponCancelResponse = await fetch(
      `http://localhost:8080/coupons/couponCancel/${couponCode}`,
      {
        method: "PUT", // Sử dụng PUT để cập nhật trạng thái
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (couponCancelResponse.ok) {
      // Nếu hủy mã giảm giá thành công, cập nhật thông báo
      notificationMessage += ` và sử dụng mã giảm giá ${couponCode}`;
    }
  } catch (couponError) {
    console.error("Lỗi khi hủy mã giảm giá:", couponError);
    message.warning("Không thể hủy mã giảm giá, nhưng đơn đặt tour đã được tạo.");
  }
}

// Thêm thông báo
addNotification(notificationMessage);

    changeComponent("list");
  };

  // Hàm kiểm tra mã giảm giá (cập nhật thêm trạng thái áp dụng)
  const fetchCoupon = async () => {
    if (!couponCode.trim()) {
      message.warning("Vui lòng nhập mã giảm giá!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/coupons/by-codecoupon/${couponCode}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tìm thấy mã giảm giá");
      }

      const data = await response.json();
      const couponDiscount = data.result?.discount || 0; // Lấy discount từ coupon, mặc định là 0

      if (selectedTour && selectedTour.price) {
        // Tính toán giá ban đầu với giảm giá tour
        const priceWithTourDiscount = selectedTour.saleTour 
          ? selectedTour.price * (1 - selectedTour.percentSale / 100) 
          : selectedTour.price;

        // Tính tổng tiền sau khi áp dụng giảm giá tour và mã giảm giá
        const totalBeforeDiscount = priceWithTourDiscount * booking.numberOfCustomer;
        const finalDiscountedTotal = totalBeforeDiscount * (1 - (couponDiscount / 100)); 

        setBooking((prevBooking) => ({
          ...prevBooking,
          totalMoney: Math.round(finalDiscountedTotal), // Làm tròn tổng tiền
        }));

        setIsCouponApplied(true);
        message.success(`Mã giảm giá hợp lệ! Giảm ${couponDiscount}%`);
      } else {
        message.warning("Vui lòng chọn tour trước khi áp dụng mã giảm giá.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin mã giảm giá:", error);
      message.error("Mã giảm giá không hợp lệ!");
    }
  };

  const [isCouponApplied, setIsCouponApplied] = useState(false); // Trạng thái áp dụng mã giảm giá

  // Hàm để hủy mã giảm giá
  const handleCancelCoupon = () => {
    setCouponCode(""); // Xóa mã giảm giá
    setIsCouponApplied(false); // Cho phép áp dụng mã giảm giá mới

    if (selectedTour) {
      // Tính lại giá tour với giảm giá ban đầu (nếu có)
      const priceWithTourDiscount = selectedTour.saleTour && selectedTour.percentSale
        ? selectedTour.price * (1 - selectedTour.percentSale / 100)
        : selectedTour.price;

      const totalPrice = priceWithTourDiscount * booking.numberOfCustomer;
      
      setBooking((prevBooking) => ({
        ...prevBooking,
        totalMoney: Math.round(totalPrice),
      }));
    }
  };

  useEffect(() => {
    if (selectedTour) {
      let priceWithTourDiscount;
      
      // Tính giá sau khi giảm giá tour
      if (selectedTour.saleTour && selectedTour.percentSale) {
        priceWithTourDiscount = selectedTour.price * (1 - selectedTour.percentSale / 100);
      } else {
        priceWithTourDiscount = selectedTour.price;
      }

      // Nếu đã áp dụng mã giảm giá, tính toán lại với mã giảm giá
      if (isCouponApplied) {
        const couponDiscount = 10; // Giả sử đã có mã giảm giá 10%
        const totalBeforeDiscount = priceWithTourDiscount * booking.numberOfCustomer;
        const finalDiscountedTotal = totalBeforeDiscount * (1 - (couponDiscount / 100));

        setBooking((prevBooking) => ({
          ...prevBooking,
          totalMoney: Math.round(finalDiscountedTotal),
        }));
      } else {
        // Nếu chưa áp dụng mã giảm giá, tính tổng tiền bình thường
        const totalPrice = priceWithTourDiscount * booking.numberOfCustomer;
        setBooking((prevBooking) => ({
          ...prevBooking,
          totalMoney: Math.round(totalPrice),
        }));
      }
    }
  }, [selectedTour, booking.numberOfCustomer, isCouponApplied]);

  return (
    <div className="add-booking-form-container">
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            {/* Các trường nhập liệu bên trái */}

            <Form.Item label="Tên khách hàng">
              <Input
                name="customerName"
                value={booking.customerName}
                onChange={handleInputChange}
                ref={(el) => (inputRefs.current.customerName = el)}
              />
            </Form.Item>
            <Form.Item label="Email khách hàng">
              <Input
                name="customerEmail"
                value={booking.customerEmail}
                onChange={handleInputChange}
                ref={(el) => (inputRefs.current.customerEmail = el)}
              />
            </Form.Item>
            <Form.Item label="Số điện thoại khách hàng">
              <Row gutter={8}>
                <Col span={16}>
                  <Input
                    name="customerPhoneNumber"
                    value={booking.customerPhoneNumber}
                    onChange={handleInputChange}
                    ref={(el) => (inputRefs.current.customerPhoneNumber = el)}
                  />
                </Col>
                <Col span={8}>
                  <Button type="primary" onClick={handleCheckCustomer}>
                    Kiểm tra
                  </Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="Tỉnh/Thành phố">
              <Select
                name="customerCity"
                value={booking.customerCity}
                onChange={handleCityChange}
                placeholder="Chọn Tỉnh/Thành phố"
                ref={(el) => (inputRefs.current.customerCity = el)}
              >
                {cities.map((city) => (
                  <Option key={city} value={city}>
                    {city}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Quận/Huyện">
              <Select
                name="customerDistrict"
                value={booking.customerDistrict}
                onChange={handleDistrictChange}
                placeholder="Chọn Quận/Huyện"
                disabled={!booking.customerCity} // Chỉ cho phép chọn khi đã chọn Tỉnh/Thành phố
                ref={(el) => (inputRefs.current.customerDistrict = el)}
              >
                {availableDistricts.map((district) => (
                  <Option key={district} value={district}>
                    {district}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Địa chỉ cụ thể">
              <Input
                name="customerAddress"
                value={booking.customerAddress}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Số lượng khách hàng">
              <Input
                type="text"
                name="numberOfCustomer"
                value={booking.numberOfCustomer}
                onChange={handleNumberOfCustomerChange} // Cập nhật tổng tiền
                ref={(el) => (inputRefs.current.numberOfCustomer = el)}
              />
            </Form.Item>
            <Form.Item label="Mã Tour">
              <Select
                name="tourCode"
                value={booking.tourCode}
                onChange={handleTourChange} // Cập nhật thông tin khi chọn tour
                placeholder="Chọn mã tour"
                ref={(el) => (inputRefs.current.tourCode = el)}
              >
                {tours.map((tour) => (
                  <Option key={tour.tourCode} value={tour.tourCode}>
                    {tour.tourCode} - {tour.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Ngày dự kiến">
              <DatePicker
                format="YYYY-MM-DD"
                onChange={(date) => handleDateChange("expectedDate", date)}
                ref={(el) => (inputRefs.current.expectedDate = el)}
              />
            </Form.Item>
            <Form.Item label="Ghi chú">
              <Input.TextArea
                name="note"
                value={booking.note}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Thông tin tour hiển thị bên phải */}
            {selectedTour && (
              <div className="tour-info">
                <h3>Thông tin tour</h3>
                <img src={selectedTour.image} alt="" />
                <p>
                  <strong>Mã Tour:</strong> {selectedTour.tourCode}
                </p>
                <p>
                  <strong>Tên Tour:</strong> {selectedTour.name}
                </p>
                <p>
                  <strong>Thời gian đi:</strong> {selectedTour.durationTour}
                </p>
                <p>
                  <strong>Phương tiện:</strong> {selectedTour.vehicle}
                </p>
                <p>
                  <strong>Khởi hành từ:</strong> {selectedTour.locationStart}
                </p>

                {/* Pricing section with sale logic */}
                {selectedTour.saleTour ? (
                  <div>
                    <p>
                      <strong>Giá Tour:</strong>
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginRight: "10px",
                          color: "gray",
                        }}
                      >
                        {formatPrice(selectedTour.price)} VNĐ
                      </span>
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {formatPrice(
                          selectedTour.price *
                            (1 - selectedTour.percentSale / 100)
                        )}{" "}
                        VNĐ
                      </span>
                    </p>
                    <p style={{ color: "red" }}>
                      <strong>Đang giảm giá!</strong> Giảm{" "}
                      {selectedTour.percentSale}%
                    </p>
                  </div>
                ) : (
                  <p>
                    <strong>Giá Tour:</strong> {formatPrice(selectedTour.price)}{" "}
                    VNĐ
                  </p>
                )}

                {/* Existing startDay rendering */}
                {selectedTour.startDay && selectedTour.startDay.length > 0 && (
                  <p>
                    <strong>Ngày khởi hành:</strong>{" "}
                    {selectedTour.startDay.join(", ")}
                  </p>
                )}
              </div>
            )}
          </Col>
        </Row>

        <Form.Item label="Hình thức thanh toán">
          <Select
            name="typePay"
            value={booking.typePay}
            onChange={(value) => handleSelectChange("typePay", value)}
            placeholder="Chọn hình thức thanh toán"
            ref={(el) => (inputRefs.current.expectedDate = el)}
          >
            <Option value="Tiền mặt">Tiền mặt</Option>
            <Option value="Chuyển khoản">Chuyển khoản</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tổng tiền">
          <Input
            type="number"
            name="totalMoney"
            value={booking.totalMoney}
            onChange={handleInputChange}
            readOnly // Không cho phép người dùng chỉnh sửa trực tiếp
          />
        </Form.Item>
        <Form.Item label="Mã Coupon">
          <Row gutter={8}>
            <Col span={16}>
              <Input
                name="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Nhập mã coupon"
                disabled={isCouponApplied} // Vô hiệu hóa khi mã giảm giá đã áp dụng
              />
            </Col>
            <Col span={8}>
              {!isCouponApplied ? (
                <Button
                  type="primary"
                  onClick={fetchCoupon}
                  disabled={!couponCode.trim()}
                >
                  Kiểm tra mã giảm giá
                </Button>
              ) : (
                <Button type="default" onClick={handleCancelCoupon}>
                  Hủy áp mã giảm giá
                </Button>
              )}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={addBooking}>
            Lưu Booking
          </Button>
          <Button
            onClick={() => changeComponent("list")}
            style={{ marginLeft: "10px" }}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddBookingForm;
