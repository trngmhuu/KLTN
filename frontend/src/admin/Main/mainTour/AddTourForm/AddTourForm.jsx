import React, { useState, useEffect } from 'react';
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
        startDay: '',
        price: '',
        vehicle: '',
        isActive: true,
    });

    const [typeTourOptions, setTypeTourOptions] = useState([]);
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTour({ ...tour, [name]: value });
    };

    // Xử lý thay đổi hình ảnh
    const handleImageChange = (file) => {
        setTour({ ...tour, image: file });
    };

    // Gọi API lấy danh sách TypeTour theo typeId
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

    const addTour = async () => {
        const formData = new FormData();

        // Đính kèm JSON chuỗi của tour vào form-data với content-type application/json
        const tourJson = JSON.stringify({
            tourCode: tour.tourCode,
            name: tour.name,
            description: tour.description,
            typeTourId: tour.typeTourId,
            typeId: tour.typeId,
            locationStart: tour.locationStart,
            price: tour.price,
            vehicle: tour.vehicle,
            isActive: tour.isActive,
        });

        // Append tour JSON dưới dạng Blob với content-type là application/json
        formData.append('tour', new Blob([tourJson], { type: 'application/json' }));

        // Đính kèm file ảnh vào form-data (nếu có)
        if (tour.image) {
            formData.append('image', tour.image);
        }

        try {
            const response = await fetch('http://localhost:8080/tours', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token nếu cần
                },
                body: formData, // Sử dụng FormData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Response Error:', errorData);
                throw new Error('Lỗi khi thêm tour');
            }

            message.success('Tour mới đã được thêm!');
            changeComponent('list'); // Chuyển về danh sách tour sau khi thêm thành công
        } catch (error) {
            message.error('Không thể thêm tour. Vui lòng thử lại!');
        }
    };



    return (
        <div className="add-tour-form-container">
            <div className="form-left">
                <Form layout="vertical">
                    <Form.Item label="Mã Tour">
                        <Input name="tourCode" value={tour.tourCode} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Tên Tour">
                        <Input name="name" value={tour.name} onChange={handleInputChange} />
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
                    <Form.Item label="Mô tả">
                        <Input.TextArea name="description" value={tour.description} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Hình ảnh">
                        <Upload
                            beforeUpload={(file) => {
                                handleImageChange(file);
                                return false;  // Ngăn không cho upload ngay lập tức
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                        </Upload>
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
                        <Input
                            name="timeDate"
                            value={tour.timeDate}
                            onChange={handleInputChange}
                            placeholder="YYYY-MM-DD"
                        />
                    </Form.Item>
                    <Form.Item label="Giá">
                        <Input type="number" name="price" value={tour.price} onChange={handleInputChange} />
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
                            <Option value="Xe khách giường nằm">Xe khách giường nằm</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Trạng thái">
                        <Select
                            name="isActive"
                            value={tour.isActive ? 'active' : 'inactive'}
                            onChange={(value) => setTour({ ...tour, isActive: value === 'active' })}
                        >
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Không hoạt động</Option>
                        </Select>
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
