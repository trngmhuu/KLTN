import React, { useState, useRef } from 'react';
import { Form, Input, Button, message, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './addTourForm.css';
import cities from "../../../../assets/data/cities.json"
import { useNotifications } from '../../../../context/NotificationContext';

const { Option } = Select;

function AddTourForm({ changeComponent }) {
    const { addNotification } = useNotifications();
    const [tour, setTour] = useState({
        tourCode: '',
        name: '',
        image: null,
        typeTourName: '',
        typeId: '',
        locationStart: '',
        startDay: [],
        durationTour: '',
        price: '',
        vehicle: '',
        isActive: false,
        saleTour: false,
        percentSale: 0
    });

    const [typeTourOptions, setTypeTourOptions] = useState([]);
    const token = localStorage.getItem('token');
    const inputRefs = useRef({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTour({ ...tour, [name]: value });
    };

    const handleImageChange = (file) => {
        setTour({ ...tour, image: file });
    };

    const fetchTypeToursByTypeId = async (typeId) => {
        try {
            const response = await fetch(`http://localhost:8080/typetours/by-type/${typeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Lỗi khi gọi API');
            const data = await response.json();
            setTypeTourOptions(data.result);
        } catch (error) {
            message.error('Không thể lấy danh sách loại tour.');
        }
    };

    const handleTypeIdChange = (value) => {
        setTour({ ...tour, typeId: value, typeTourId: '' });
        fetchTypeToursByTypeId(value);
    };

    const handleStartDayChange = (value) => {
        setTour({ ...tour, startDay: value });
    };

    const focusInput = (name) => {
        if (inputRefs.current[name]) {
            inputRefs.current[name].focus();
        }
    };

    const addTour = async () => {
        const tourCodePattern = /^[A-Z]{2}-\d{3}$/;

        if (!tour.tourCode.trim()) {
            message.error('Mã tour không được để trống!');
            focusInput('tourCode');
            return;
        }

        if (!tourCodePattern.test(tour.tourCode)) {
            message.error('Mã tour không hợp lệ! Vui lòng nhập theo định dạng: 2 chữ cái in hoa + dấu gạch + 3 chữ số (VD: CT-001)', 20);
            focusInput('tourCode');
            return;
        }

        if (!tour.name.trim()) {
            message.error('Tên tour không được để trống!');
            focusInput('name');
            return;
        }

        if (!tour.price.trim()) {
            message.error('Giá không được để trống!');
            focusInput('price');
            return;
        }

        if (isNaN(tour.price)) {
            message.error('Giá phải là một số hợp lệ!', 5);
            focusInput('price');
            return;
        }

        if (!tour.durationTour.trim()) {
            message.error("Chưa chọn thời gian đi");
            focusInput("durationTour");
            return;
        }

        if (!tour.typeId) {
            message.error('Vui lòng chọn loại tour!');
            focusInput("typeId")
            return;
        }

        if (!tour.typeTourName) {
            message.error('Vui lòng chọn phân loại!');
            focusInput("typeTourName")
            return;
        }

        if (!tour.locationStart.trim()) {
            message.error("Chưa chọn địa điểm xuất phát");
            focusInput("locationStart")
            return;
        }

        if (tour.startDay.length === 0) {
            message.error("Chưa chọn các ngày khởi hành trong tuần");
            focusInput("startDay");
            return;
        }

        if (!tour.vehicle.trim()) {
            message.error("Chưa chọn phương tiện");
            focusInput("vehicle");
            return;
        }

        if (tour.saleTour && (isNaN(tour.percentSale) || tour.percentSale <= 0 || tour.percentSale > 100)) {
            message.error("Phần trăm giảm giá phải là một số nguyên trong khoảng từ 1 đến 100.");
            focusInput("percentSale");
            return;
        }

        if (!tour.image) {
            message.error("Hãy chọn hình đại diện cho tour");
            return;
        }

        const formData = new FormData();

        const tourJson = JSON.stringify({
            tourCode: tour.tourCode,
            name: tour.name,
            typeTourName: tour.typeTourName,
            typeId: tour.typeId,
            locationStart: tour.locationStart,
            durationTour: tour.durationTour,
            startDay: tour.startDay,
            price: tour.price,
            vehicle: tour.vehicle,
            isActive: tour.isActive,
            saleTour: tour.saleTour,
            percentSale: tour.saleTour ? tour.percentSale : 0
        });

        formData.append('tour', new Blob([tourJson], { type: 'application/json' }));

        if (tour.image) {
            formData.append('image', tour.image);
        }

        try {
            const response = await fetch('http://localhost:8080/tours', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Response Error:', errorData);
                throw new Error('Lỗi khi thêm tour');
            }

            // Lấy tên người dùng từ localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const username = userInfo?.username || 'Người dùng';

            // Thêm thông báo
            addNotification(`${username} vừa tạo tour mới với mã ${tour.tourCode}`);

            message.success('Tour mới đã được thêm!');
            changeComponent('list');
        } catch (error) {
            message.error('Mã tour đã tồn tại');
        }
    };

    return (
        <div className="add-tour-form-container">
            <div className="form-left">
                <Form layout="vertical">
                    <Form.Item label="Mã Tour">
                        <Input
                            name="tourCode"
                            value={tour.tourCode}
                            onChange={handleInputChange}
                            ref={(el) => (inputRefs.current.tourCode = el)}
                        />
                    </Form.Item>
                    <Form.Item label="Tên Tour">
                        <Input
                            name="name"
                            value={tour.name}
                            onChange={handleInputChange}
                            ref={(el) => (inputRefs.current.name = el)}
                        />
                    </Form.Item>
                    <Form.Item label="Giá">
                        <Input
                            type="text"
                            name="price"
                            value={tour.price}
                            onChange={handleInputChange}
                            ref={(el) => (inputRefs.current.price = el)}
                        />
                    </Form.Item>
                    <Form.Item label="Thời gian tour">
                        <Select
                            name="durationTour"
                            value={tour.durationTour}
                            onChange={(value) => setTour({ ...tour, durationTour: value })}
                            placeholder="Chọn thời gian tour"
                            ref={(el) => (inputRefs.current.durationTour = el)}
                        >
                            <Option value="1 ngày">1 ngày</Option>
                            <Option value="2 ngày 1 đêm">2 ngày 1 đêm</Option>
                            <Option value="3 ngày 2 đêm">3 ngày 2 đêm</Option>
                            <Option value="4 ngày 3 đêm">4 ngày 3 đêm</Option>
                            <Option value="5 ngày 4 đêm">5 ngày 4 đêm</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Loại tour">
                        <Select
                            name="typeId"
                            value={tour.typeId}
                            onChange={handleTypeIdChange}
                            ref={(el) => (inputRefs.current.typeId = el)}
                        >
                            <Option value="1">Tour trong nước</Option>
                            <Option value="2">Tour ngoài nước</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Phân loại">
                        <Select
                            name="typeTourName"
                            value={tour.typeTourName}
                            onChange={(value) => setTour({ ...tour, typeTourName: value })}
                            ref={(el) => (inputRefs.current.typeTourName = el)}
                        >
                            {typeTourOptions.map((typeTour) => (
                                <Option key={typeTour.name} value={typeTour.name}>
                                    {typeTour.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Địa điểm xuất phát">
                        <Select
                            name="locationStart"
                            value={tour.locationStart}
                            onChange={(value) => setTour({ ...tour, locationStart: value })}
                            placeholder="Chọn địa điểm xuất phát"
                            ref={(el) => (inputRefs.current.locationStart = el)}
                        >
                            {cities.map((city, index) => (
                                <Option key={index} value={city}>
                                    {city}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Ngày khởi hành">
                        <Select
                            mode="multiple"
                            name="startDay"
                            value={tour.startDay}
                            onChange={handleStartDayChange}
                            placeholder="Chọn ngày khởi hành"
                            ref={(el) => (inputRefs.current.startDay = el)}
                        >
                            <Option value="Thứ 2">Thứ 2</Option>
                            <Option value="Thứ 3">Thứ 3</Option>
                            <Option value="Thứ 4">Thứ 4</Option>
                            <Option value="Thứ 5">Thứ 5</Option>
                            <Option value="Thứ 6">Thứ 6</Option>
                            <Option value="Thứ 7">Thứ 7</Option>
                            <Option value="Chủ Nhật">Chủ Nhật</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Phương tiện">
                        <Select
                            name="vehicle"
                            value={tour.vehicle}
                            onChange={(value) => setTour({ ...tour, vehicle: value })}
                            placeholder="Chọn phương tiện"
                            ref={(el) => (inputRefs.current.vehicle = el)}
                        >
                            <Option value="Ô tô">Ô tô</Option>
                            <Option value="Xe khách ghế ngồi">Xe khách ghế ngồi</Option>
                            <Option value="Xe giường nằm">Xe giường nằm</Option>
                            <Option value="Máy bay">Máy bay</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Giảm giá">
                        <Select
                            name="saleTour"
                            value={tour.saleTour}
                            onChange={(value) => setTour({ ...tour, saleTour: value })}
                            ref={(el) => (inputRefs.current.saleTour = el)}
                        >
                            <Option value={true}>Đang giảm giá</Option>
                            <Option value={false}>Không giảm giá</Option>
                        </Select>
                    </Form.Item>

                    {tour.saleTour && (
                        <Form.Item label="Phần trăm giảm giá">
                            <Input
                                type="number"
                                name="percentSale"
                                value={tour.percentSale}
                                onChange={(e) => setTour({ ...tour, percentSale: e.target.value })}
                                ref={(el) => (inputRefs.current.percentSale = el)}
                            />
                        </Form.Item>
                    )}

                    <Form.Item label="Hình ảnh">
                        <Upload
                            beforeUpload={(file) => {
                                handleImageChange(file);
                                return false;
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Button type="primary" onClick={addTour}>
                        Lưu Tour
                    </Button>
                    <Button onClick={() => changeComponent('list')} style={{ marginLeft: '10px' }}>
                        Hủy
                    </Button>
                </Form>
            </div>
            <div className="form-right">
                {tour.image && (
                    <img
                        src={URL.createObjectURL(tour.image)}
                        alt="Tour Preview"
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                )}
            </div>
        </div>
    );
}

export default AddTourForm;
