import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Row, Col } from 'antd';
import './addBookingForm.css';
import moment from "moment";
import cities from "../../../../assets/data/cities.json"
import districts from "../../../../assets/data/districtData.json"
import { useNotifications } from '../../../../context/NotificationContext';

const { Option } = Select;

function AddBookingForm({ changeComponent }) {
    const { addNotification } = useNotifications();
    const [booking, setBooking] = useState({
        bookingCode: '',
        customerName: '',
        customerEmail: '',
        customerPhoneNumber: '',
        customerCity: '',
        customerDistrict: '',
        customerAddress: '',
        numberOfCustomer: 1,
        bookingDate: moment().format('DD/MM/YYYY'),
        expectedDate: '',
        note: '',
        tourCode: '',
        typePay: '',
        totalMoney: '',
        payBooking: false,
    });
    

    const [tours, setTours] = useState([]); // State lưu danh sách các tour
    const [selectedTour, setSelectedTour] = useState(null); // State lưu thông tin tour khi chọn
    const inputRefs = useRef({});

    // useEffect để lấy danh sách mã tour từ API
    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await fetch('http://localhost:8080/tours', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Lỗi khi lấy danh sách tour');
                const data = await response.json();
                setTours(data.result); // Lưu danh sách tour vào state
            } catch (error) {
                message.error('Không thể tải danh sách tour.');
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
                const response = await fetch(`http://localhost:8080/tours/by-tourcode/${tourCode}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Lỗi khi lấy thông tin tour');
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
                message.error('Không thể lấy thông tin tour.');
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
            return { ...prevBooking, numberOfCustomer, totalMoney: updatedTotalMoney };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBooking({ ...booking, [name]: value });
    };

    const handleDateChange = (name, date) => {
        setBooking({ ...booking, [name]: date ? date.format('DD-MM-YYYY') : '' });
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
    // 2. Hàm xử lý thay đổi khi người dùng chọn Tỉnh/Thành phố
    const handleCityChange = (city) => {
        setBooking((prevBooking) => ({ ...prevBooking, customerCity: city, customerDistrict: '' }));
        // Lọc danh sách quận/huyện theo Tỉnh/Thành phố đã chọn
        const filteredDistricts = districts[city] || [];
        setAvailableDistricts(filteredDistricts);
    };

    // 3. Hàm xử lý khi người dùng chọn Quận/Huyện
    const handleDistrictChange = (district) => {
        setBooking((prevBooking) => ({ ...prevBooking, customerDistrict: district }));
    };

    const addBooking = async () => {

        if (!booking.customerName.trim()) {
            message.error('Tên khách hàng không được để trống!');
            focusInput('customerName');
            return;
        }

        if (!booking.customerEmail.trim()) {
            message.error('Email khách hàng không được để trống!');
            focusInput('customerEmail');
            return;
        }

        if (!booking.customerPhoneNumber.trim()) {
            message.error('Số điện thoại không được để trống!');
            focusInput('customerPhoneNumber');
            return;
        }

        if (!booking.customerCity.trim()) {
            message.error('Vui lòng chọn Tỉnh/Thành phố!');
            focusInput("customerCity");
            return;
        }

        if (!booking.customerDistrict.trim()) {
            message.error('Vui lòng chọn Quận/Huyện!');
            focusInput("customerDistrict");
            return;
        }

        if (booking.numberOfCustomer <= 0) {
            message.error('Số lượng khách hàng phải lớn hơn 0!');
            focusInput('numberOfCustomer');
            return;
        }

        if (!booking.tourCode.trim()) {
            message.error("Chưa chọn tour");
            focusInput("tourCode");
            return;
        }

        if (!booking.expectedDate || moment(booking.expectedDate, 'DD/MM/YYYY').isSameOrBefore(moment(), 'day')) {
            message.error('Ngày dự kiến phải được chọn và sau ngày hiện tại!');
            focusInput("expectedDate")
            return;
        }

        if (!booking.typePay.trim()) {
            message.error("Chưa chọn hình thức thanh toán");
            focusInput("typePay");
            return;
        }

        if (booking.payBooking === null || booking.payBooking === undefined) {
            message.error('Vui lòng chọn trạng thái thanh toán!');
            return;
        }

        // Chuẩn hóa định dạng ngày thành dd/mm/yyyy
        const formattedBooking = {
            ...booking,
            bookingDate: moment(booking.bookingDate, 'DD-MM-YYYY').format('DD/MM/YYYY'),
            expectedDate: moment(booking.expectedDate, 'DD-MM-YYYY').format('DD/MM/YYYY'),
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
        const customerResponse = await fetch('http://localhost:8080/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
        });


        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/bookings/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formattedBooking),
        });

        if (!response.ok) throw new Error('Lỗi khi thêm booking');
        const bookingData = await response.json();

        // Lấy tên người dùng từ localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const username = userInfo?.username || 'Người dùng';

        // Thêm thông báo
        addNotification(`${username} vừa tạo đơn đặt tour mới với tour ${booking.tourCode}, mã đặt tour là ${bookingData.result.bookingCode}`);
        message.success('Booking mới đã được thêm!');
        changeComponent('list');

    };

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
                            <Input
                                name="customerPhoneNumber"
                                value={booking.customerPhoneNumber}
                                onChange={handleInputChange}
                                ref={(el) => (inputRefs.current.customerPhoneNumber = el)}
                            />
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
                                    <Option key={city} value={city}>{city}</Option>
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
                                    <Option key={district} value={district}>{district}</Option>
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
                                type="number"
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
                                onChange={(date) => handleDateChange('expectedDate', date)}
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
                                <p><strong>Mã Tour:</strong> {selectedTour.tourCode}</p>
                                <p><strong>Tên Tour:</strong> {selectedTour.name}</p>
                                {/* <p><strong>Ngày khởi hành:</strong> {selectedTour.startDay}</p> */}
                                <p><strong>Giá Tour:</strong> {selectedTour.price}</p>
                            </div>
                        )}
                    </Col>
                </Row>

                <Form.Item label="Hình thức thanh toán">
                    <Select
                        name="typePay"
                        value={booking.typePay}
                        onChange={(value) => handleSelectChange('typePay', value)}
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
                <Form.Item label="Đã thanh toán">
                    <Select
                        name="payBooking"
                        value={booking.payBooking}
                        onChange={(value) => handleSelectChange('payBooking', value)}
                        placeholder="Chọn trạng thái thanh toán"
                    >
                        <Option value={true}>Đã thanh toán</Option>
                        <Option value={false}>Chưa thanh toán</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={addBooking}>
                        Lưu Booking
                    </Button>
                    <Button onClick={() => changeComponent('list')} style={{ marginLeft: '10px' }}>
                        Hủy
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddBookingForm;
