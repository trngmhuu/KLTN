import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Row, Col } from 'antd';
import './updateCancelBooking.css';
import moment from 'moment';

const { Option } = Select;

function UpdateCancelBooking({ changeComponent, bookingCode }) {
    const [booking, setBooking] = useState({
        bookingCode: '',
        customerName: '',
        customerEmail: '',
        customerPhoneNumber: '',
        customerCity: '',
        customerDistrict: '',
        customerAddress: '',
        numberOfCustomer: 1,
        bookingDate: '',
        expectedDate: '',
        note: '',
        tourCode: '',
        typePay: '',
        totalMoney: '',
        payBooking: false,
        activeBooking: "",
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

    // useEffect để gọi API và lấy thông tin khi bookingCode thay đổi
    useEffect(() => {
        const fetchBookingByCode = async () => {
            if (bookingCode) {
                try {
                    const response = await fetch(`http://localhost:8080/bookings/by-bookingcode/${bookingCode}`);
                    if (!response.ok) throw new Error('Không tìm thấy booking với mã này');
                    const data = await response.json();
                    const bookingData = data.result;

                    // Cập nhật các trường dữ liệu cho form
                    setBooking({
                        bookingCode: bookingData.bookingCode,
                        customerName: bookingData.customerName,
                        customerEmail: bookingData.customerEmail,
                        customerPhoneNumber: bookingData.customerPhoneNumber,
                        customerAddress: bookingData.customerAddress,
                        numberOfCustomer: bookingData.numberOfCustomer,
                        bookingDate: bookingData.bookingDate,
                        expectedDate: bookingData.expectedDate
                            ? moment(bookingData.expectedDate, 'DD-MM-YYYY').format('DD/MM/YYYY') // Chuyển đổi ngày dự kiến
                            : null,
                        note: bookingData.note,
                        tourCode: bookingData.tourCode,
                        typePay: bookingData.typePay,
                        totalMoney: bookingData.totalMoney,
                        payBooking: bookingData.payBooking,
                        activeBooking: bookingData.activeBooking,
                    });

                    // Set selectedTour nếu có thông tin tour
                    if (bookingData.tourCode) {
                        handleTourChange(bookingData.tourCode);  // Lấy thông tin tour tương ứng
                    }
                } catch (error) {
                    message.error(error.message);
                    setSelectedTour(null); // Reset khi có lỗi
                }
            }
        };

        fetchBookingByCode();
    }, [bookingCode]); // Chạy lại mỗi khi bookingCode thay đổi

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
        setBooking({ ...booking, [name]: date ? date.format('YYYY-MM-DD') : '' });
    };

    const handleSelectChange = (name, value) => {
        setBooking({ ...booking, [name]: value });
    };
    const handleActiveBookingChange = (value) => {
        setBooking({ ...booking, activeBooking: value });
    };

    const handleActiveBookingChangePay = (value) => {
        setBooking({ ...booking, payBooking: value });
    };

    const focusInput = (name) => {
        if (inputRefs.current[name]) {
            inputRefs.current[name].focus();
        }
    };

    const updateBooking = async () => {
        if (!booking.bookingCode.trim()) {
            message.error('Mã booking không được để trống!');
            focusInput('bookingCode');
            return;
        }

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

        // if (!booking.customerCity.trim()) {
        //     message.error('Vui lòng chọn Tỉnh/Thành phố!');
        //     focusInput("customerCity");
        //     return;
        // }

        // if (!booking.customerDistrict.trim()) {
        //     message.error('Vui lòng chọn Quận/Huyện!');
        //     focusInput("customerDistrict");
        //     return;
        // }

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

        if (!booking.typePay.trim()) {
            message.error("Chưa chọn hình thức thanh toán");
            focusInput("typePay");
            return;
        }

        if (booking.payBooking === null || booking.payBooking === undefined) {
            message.error('Vui lòng chọn trạng thái thanh toán!');
            return;
        }

        try {
            

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/bookings/bookingCode/${booking.bookingCode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(booking),
            });

            if (!response.ok) throw new Error('Lỗi khi cập nhật booking');
            message.success('Booking đã được cập nhật!');
            changeComponent('list');
        } catch (error) {
            message.error('Không thể cập nhật booking. Vui lòng thử lại!');
        }
    };

    return (
        <div className="add-booking-form-container">
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        {/* Các trường nhập liệu bên trái */}
                        <Form.Item label="Mã Booking">
                            <Input
                                name="bookingCode"
                                value={booking.bookingCode}
                                onChange={handleInputChange} // Lắng nghe thay đổi mã booking
                                ref={(el) => (inputRefs.current.bookingCode = el)}
                            />
                        </Form.Item>
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
                            />
                        </Form.Item>
                        <Form.Item label="Mã Tour">
                            <Select
                                name="tourCode"
                                value={booking.tourCode}
                                onChange={handleTourChange} // Khi chọn tour
                            >
                                {tours.map((tour) => (
                                    <Option key={tour.tourCode} value={tour.tourCode}>
                                        {tour.tourCode}-{tour.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Trạng thái thanh toán">
                            <Select
                                value={booking.payBooking}
                                onChange={handleActiveBookingChangePay}
                            >
                                <Option value={true}>Đã thanh toán</Option>
                                <Option value={false}>Chưa thanh toán</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {/* Thông tin tour hiển thị bên phải */}
                        {selectedTour && (
                            <div className="tour-info">
                                <h3>Thông tin tour</h3>
                                <p><strong>Mã Tour:</strong> {selectedTour.tourCode}</p>
                                <p><strong>Tên Tour:</strong> {selectedTour.name}</p>
                                <p><strong>Ngày khởi hành:</strong> {selectedTour.startDate}</p>
                                <p><strong>Ngày kết thúc:</strong> {selectedTour.endDate}</p>
                                <p><strong>Giá Tour:</strong> {selectedTour.price}</p>
                                <p><strong>Mô tả:</strong> {selectedTour.description}</p>
                            </div>
                        )}
                        {/* Các trường nhập liệu bên phải */}
                        <Form.Item label="Ngày dự kiến">
                            <DatePicker
                                value={booking.expectedDate ? moment(booking.expectedDate, 'YYYY-MM-DD') : null}
                                onChange={(date) => handleDateChange('expectedDate', date)}
                            />
                        </Form.Item>


                        <Form.Item label="Ghi chú">
                            <Input.TextArea
                                name="note"
                                value={booking.note}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label="Hình thức thanh toán">
                            <Select
                                value={booking.typePay}
                                onChange={(value) => handleSelectChange('typePay', value)}
                            >
                                <Option value="cash">Tiền mặt</Option>
                                <Option value="creditCard">Thẻ tín dụng</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Tổng tiền">
                            <Input
                                name="totalMoney"
                                value={booking.totalMoney}
                                disabled
                            />
                        </Form.Item>
                        <Form.Item label="Trạng thái booking">
                            <Select
                                value={booking.activeBooking}
                                onChange={handleActiveBookingChange}
                            >
                                <Option value="Hoạt động">Hoạt động</Option>
                                <Option value="Đang chờ hủy">Đang chờ hủy</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" onClick={updateBooking}>
                        Cập nhật
                    </Button>
                    <Button onClick={() => changeComponent('list')} style={{ marginLeft: '10px' }}>
                        Hủy
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
export default UpdateCancelBooking;