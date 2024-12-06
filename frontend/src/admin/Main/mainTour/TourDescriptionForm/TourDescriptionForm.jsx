import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Upload, Image, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

function TourDescriptionForm({ changeComponent, tourCode }) {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(null);
    const [tourDescription, setTourDescription] = useState({
        tourCode: '',
        header: '',
        content: '',
        image: null
    });
    const [tourDescriptions, setTourDescriptions] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (tourCode) {
            console.log('Tour Code Selected:', tourCode);
            setTourDescription((prev) => ({ ...prev, tourCode }));
            getTourDescriptions(tourCode);
        }
    }, [tourCode]);

    const getTourDescriptions = async (tourCode) => {
        try {
            const response = await fetch(`https://tourwebbe.onrender.com/tours-description/by-tourcode/${tourCode}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to fetch tour descriptions');

            const data = await response.json();
            if (data && Array.isArray(data.result)) {
                setTourDescriptions(data.result);
            } else {
                setTourDescriptions([]);
            }
        } catch (error) {
            console.error('Error fetching tour descriptions:', error);
            message.error('Failed to load tour descriptions. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTourDescription({ ...tourDescription, [name]: value });
    };

    const handleImageChange = (file) => {
        setTourDescription({ ...tourDescription, image: file });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        const tourDescriptionJson = JSON.stringify({
            tourCode: tourDescription.tourCode,
            header: tourDescription.header,
            content: tourDescription.content,
        });
        formData.append('tourDescription', new Blob([tourDescriptionJson], { type: 'application/json' }));
        if (tourDescription.image) formData.append('image', tourDescription.image);

        try {
            const response = await fetch('https://tourwebbe.onrender.com/tours-description', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to add tour description');

            message.success('Thêm lịch trình thành công!');
            setTourDescription({ tourCode: tourCode || '', header: '', content: '', image: null });
            form.resetFields(); // Reset tất cả trường form
            getTourDescriptions(tourDescription.tourCode);
        } catch (error) {
            console.error('Error adding tour description:', error);
            message.error('Thêm lịch trình thất bại. Hãy thử lại.');
        }
    };

    // Handle Delete Function
    const handleDelete = (id, index) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this description?',
            content: 'Once deleted, this action cannot be undone.',
            onOk: async () => {
                try {
                    const response = await fetch(`https://tourwebbe.onrender.com/tours-description/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` },
                    });

                    if (!response.ok) throw new Error('Failed to delete tour description');

                    message.success('Tour description deleted successfully!');
                    setTourDescriptions(tourDescriptions.filter((_, i) => i !== index));
                } catch (error) {
                    message.error('Failed to delete tour description. Please try again.');
                }
            },
        });
    };

    // Handle Edit Action (No form population, just update the list)
    const handleSaveEdit = async (desc, index) => {
        const formData = new FormData();
        const updatedDescriptionJson = JSON.stringify({
            header: desc.header,
            content: desc.content,

        });
        formData.append('tourDescription', new Blob([updatedDescriptionJson], { type: 'application/json' }));
        if (desc.image instanceof File) {
            formData.append('image', desc.image);
        }

        try {
            const response = await fetch(`https://tourwebbe.onrender.com/tours-description/${desc.idAsString}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },  // Không thêm 'Content-Type' khi dùng FormData
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to update tour description');

            message.success('Cập nhật lịch trình thành công!');
            setIsEditing(null); // Thoát khỏi chế độ chỉnh sửa
            getTourDescriptions(tourDescription.tourCode); // Làm mới danh sách
        } catch (error) {
            console.error('Error updating tour description:', error);
            message.error('Cập nhật lịch trình thất bại. Hãy thử lại.');
        }
    };


    const handleEditInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedTourDescriptions = [...tourDescriptions];
        updatedTourDescriptions[index] = { ...updatedTourDescriptions[index], [name]: value };
        setTourDescriptions(updatedTourDescriptions);
    };


    return (
        <div className="tour-description-form-container">
            <Form form={form} layout="vertical" initialValues={{ tourCode }}>
                {/* */}
                <Form.Item label="Mã tour cần thêm lịch trình" name="tourCode">
                    <Input
                        value={tourDescription.tourCode}
                        onChange={handleInputChange}
                        name="tourCode"
                        disabled
                    />
                </Form.Item>

                <Form.Item label="Tiêu đề" name="header">
                    <Input
                        name="header"
                        value={tourDescription.header}
                        onChange={handleInputChange}
                    />
                </Form.Item>

                <Form.Item label="Nội dung" name="content">
                    <TextArea
                        rows={6}
                        name="content"
                        value={tourDescription.content}
                        onChange={handleInputChange}
                    />
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
                    {tourDescription.image && (
                        <div style={{ marginTop: '10px' }}>
                            <Image width={200} src={URL.createObjectURL(tourDescription.image)} alt="Image Preview" />
                        </div>
                    )}
                </Form.Item>

                {/* Buttons */}
                <div style={{ display: 'flex' }}>
                    <Button type="primary" onClick={handleSubmit}>Lưu lịch trình</Button>
                    <Button onClick={() => changeComponent('list')} style={{ marginLeft: '10px' }}>Hủy</Button>
                </div>
            </Form>

            {/* Tour Descriptions List */}
            <div style={{
                marginTop: '30px',
                padding: '20px',
                border: '3px solid #1890ff',
                borderRadius: '10px',
                backgroundColor: '#f0f5ff'
            }}>
                <h2 style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>
                    Danh sách lịch trình
                </h2>
                {Array.isArray(tourDescriptions) && tourDescriptions.length > 0 ? (
                    tourDescriptions.map((desc, index) => (
                        <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '15px' }}>
                            {isEditing === index ? (
                                // Editable form
                                <div>
                                    <Input
                                        name="header"
                                        value={desc.header}
                                        onChange={(e) => handleEditInputChange(e, index)} // Sử dụng hàm mới
                                    />
                                    <TextArea
                                        rows={4}
                                        name="content"
                                        value={desc.content}
                                        onChange={(e) => handleEditInputChange(e, index)} // Sử dụng hàm mới
                                    />

                                    <Upload
                                        beforeUpload={(file) => {
                                            // Handle image upload logic
                                            const updatedDesc = { ...desc, image: file };
                                            const updatedTourDescriptions = [...tourDescriptions];
                                            updatedTourDescriptions[index] = updatedDesc;
                                            setTourDescriptions(updatedTourDescriptions);
                                            return false; // Prevent default upload behavior
                                        }}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                                    </Upload>
                                    {desc.image && (
                                        <div style={{ marginTop: '10px' }}>
                                            {/* Use the correct URL condition */}
                                            <Image
                                                width={200}
                                                src={desc.image instanceof File ? URL.createObjectURL(desc.image) : desc.image}
                                                alt="Image Preview"
                                            />
                                        </div>
                                    )}
                                    <div style={{ marginTop: '10px' }}>
                                        <Button type="primary" onClick={() => handleSaveEdit(desc, index)}>
                                            Save
                                        </Button>
                                        <Button
                                            onClick={() => setIsEditing(null)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                // View only
                                <div>
                                    <h3>{desc.header}</h3>
                                    <p style={{ whiteSpace: 'pre-line' }}>{desc.content}</p>
                                    {/* Check if desc.image is already a URL or Blob */}
                                    {desc.image && (
                                        <div style={{ marginTop: '10px' }}>
                                            {/* Only use createObjectURL for File objects */}
                                            <Image
                                                width={200}
                                                src={desc.image instanceof File ? URL.createObjectURL(desc.image) : desc.image}
                                                alt={desc.header}
                                            />
                                        </div>
                                    )}
                                    <div style={{ marginTop: '10px' }}>
                                        <Button
                                            icon={<EditOutlined />}
                                            type="link"
                                            onClick={() => setIsEditing(index)} // Enable edit mode
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            icon={<DeleteOutlined />}
                                            type="link"
                                            danger
                                            onClick={() => handleDelete(desc.idAsString, index)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Lịch trình chưa tồn tại.</p>
                )}
            </div>
        </div>
    );
}

export default TourDescriptionForm;