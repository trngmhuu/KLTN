import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Row, Col } from 'antd';
import './addBookingForm.css';

const { Option } = Select;

function AddBookingForm({ changeComponent }) {
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
        activeBooking: true,
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
        setBooking({ ...booking, [name]: date ? date.format('YYYY-MM-DD') : '' });
    };

    const handleSelectChange = (name, value) => {
        setBooking({ ...booking, [name]: value });
    };

    const focusInput = (name) => {
        if (inputRefs.current[name]) {
            inputRefs.current[name].focus();
        }
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

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/bookings/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(booking),
            });

            if (!response.ok) throw new Error('Lỗi khi thêm booking');
            message.success('Booking mới đã được thêm!');
            changeComponent('list');
        } catch (error) {
            message.error('Không thể thêm booking. Vui lòng thử lại!');
        }
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
                        <Form.Item label="Địa chỉ khách hàng">
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
                                onChange={handleTourChange} // Cập nhật thông tin khi chọn tour
                                placeholder="Chọn mã tour"
                            >
                                {tours.map((tour) => (
                                    <Option key={tour.tourCode} value={tour.tourCode}>
                                        {tour.tourCode} - {tour.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Ngày đặt">
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={(date) => handleDateChange('bookingDate', date)}
                            />
                        </Form.Item>
                        <Form.Item label="Ngày dự kiến">
                            <DatePicker
                                format="YYYY-MM-DD"
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
                    </Col>
                </Row>

                <Form.Item label="Hình thức thanh toán">
                    <Select
                        name="typePay"
                        value={booking.typePay}
                        onChange={(value) => handleSelectChange('typePay', value)}
                        placeholder="Chọn hình thức thanh toán"
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
