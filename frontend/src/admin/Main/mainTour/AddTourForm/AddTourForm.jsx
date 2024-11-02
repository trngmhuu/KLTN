import React, { useState, useRef } from 'react';
import { Form, Input, Button, message, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './addTourForm.css';

const { Option } = Select;

function AddTourForm({ changeComponent }) {
    const [tour, setTour] = useState({
        tourCode: '',
        name: '',
        description: '',
        image: null,
        typeTourId: '',
        typeId: '',
        locationStart: '',
        startDay: [],
        durationTour: '', // Thêm trường durationTour vào state
        price: '',
        vehicle: '',
        isActive: true,
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

        if (!tour.description.trim()) {
            message.error('Mô tả không được để trống!');
            focusInput('description');
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

        const formData = new FormData();

        const tourJson = JSON.stringify({
            tourCode: tour.tourCode,
            name: tour.name,
            description: tour.description,
            typeTourId: tour.typeTourId,
            typeId: tour.typeId,
            locationStart: tour.locationStart,
            durationTour: tour.durationTour, // Thêm durationTour vào dữ liệu gửi đi
            price: tour.price,
            vehicle: tour.vehicle,
            isActive: tour.isActive,
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

            message.success('Tour mới đã được thêm!');
            changeComponent('list');
        } catch (error) {
            message.error('Không thể thêm tour. Vui lòng thử lại!');
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
                    <Form.Item label="Mô tả">
                        <Input.TextArea
                            name="description"
                            value={tour.description}
                            onChange={handleInputChange}
                            ref={(el) => (inputRefs.current.description = el)}
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
                        >
                            <Option value="2 ngày 1 đêm">2 ngày 1 đêm</Option>
                            <Option value="3 ngày 2 đêm">3 ngày 2 đêm</Option>
                            <Option value="4 ngày 3 đêm">4 ngày 3 đêm</Option>
                            <Option value="5 ngày 4 đêm">5 ngày 4 đêm</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Phân loại">
                        <Select name="typeId" value={tour.typeId} onChange={handleTypeIdChange}>
                            <Option value="1">Tour trong nước</Option>
                            <Option value="2">Tour ngoài nước</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Loại Tour">
                        <Select
                            name="typeTourId"
                            value={tour.typeTourId}
                            onChange={(value) => setTour({ ...tour, typeTourId: value })}
                        >
                            {typeTourOptions.map((typeTour) => (
                                <Option key={typeTour.typeTourId} value={typeTour.typeTourId}>
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
                        >
                            <Option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</Option>
                            <Option value="Hà Nội">Hà Nội</Option>
                            <Option value="Đà Nẵng">Đà Nẵng</Option>
                            <Option value="Khác">Khác</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Ngày khởi hành">
                        <Select
                            mode="multiple"
                            name="startDay"
                            value={tour.startDay}
                            onChange={handleStartDayChange}
                            placeholder="Chọn ngày khởi hành"
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
                        >
                            <Option value="Ô tô">Ô tô</Option>
                            <Option value="Xe khách ghế ngồi">Xe khách ghế ngồi</Option>
                            <Option value="Xe giường nằm">Xe giường nằm</Option>
                            <Option value="Máy bay">Máy bay</Option>
                        </Select>
                    </Form.Item>
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
