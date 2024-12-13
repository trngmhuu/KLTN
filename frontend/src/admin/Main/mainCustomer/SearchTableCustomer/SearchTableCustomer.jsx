import {
  Tag,
  Button,
  Form,
  Input,
  Select,
  Table,
  Modal,
  message,
  DatePicker,
} from "antd";
import React, { useState, useEffect } from "react";
import "./searchTableCustomer.css";
import {
  DeleteFilled,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import cites from "../../../../assets/data/cities.json";
import districts from "../../../../assets/data/districtData.json";

const { confirm } = Modal;
const { Option } = Select;

function SearchTableCustomer() {
  const [searchParams, setSearchParams] = useState({
    customerName: "",
    customerEmail: "",
    customerPhoneNumber: "",
  });
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    customerEmail: "",
    customerPhoneNumber: "",
    customerType: "",
    customerCity: "",
    customerDistrict: "",
    customerAddress: "",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://tourwebbe.onrender.com/customers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      setData(result.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleReset = () =>
    setSearchParams({
      customerName: "",
      customerEmail: "",
      customerPhoneNumber: "",
    });
  const handleReload = () => fetchData();
  // const handleAdd = () => setIsModalVisible(true);

  const handleEdit = (record) => {
    setSelectedCustomer(record);
    setSelectedCity(record.customerCity); // Thiết lập thành phố đã chọn
    setAvailableDistricts(districtData[record.customerCity] || []); // Thiết lập danh sách quận tương ứng
    setIsDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalVisible(false);
    setSelectedCustomer(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://tourwebbe.onrender.com/customers/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        message.success("Đã xóa khách hàng thành công!");
        fetchData();
      } else throw new Error("Failed to delete customer");
    } catch (error) {
      console.error("Error deleting customer:", error);
      message.error("Có lỗi xảy ra khi xóa!");
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa khách hàng này?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDelete(id);
      },
    });
  };

  const handleNewCustomerChange = (name, value) => {
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  // const handleSaveNewCustomer = async () => {
  //     try {
  //         const token = localStorage.getItem('token');
  //         const response = await fetch('http://localhost:8080/customers', {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //                 'Authorization': `Bearer ${token}`,
  //             },
  //             body: JSON.stringify(newCustomer),
  //         });

  //         if (response.ok) {
  //             message.success('Khách hàng đã được thêm thành công!');
  //             setIsModalVisible(false);
  //             fetchData();
  //             setNewCustomer({
  //                 customerName: '',
  //                 customerEmail: '',
  //                 customerPhoneNumber: '',
  //                 customerType: '',
  //                 customerCity: '',
  //                 customerDistrict: '',
  //                 customerAddress: '',
  //                 customerDateOfBirth: null,  // Reset Date of Birth
  //             });
  //         } else throw new Error('Failed to add customer');
  //     } catch (error) {
  //         console.error('Error adding customer:', error);
  //         message.error('Kiểm tra dữ liệu thêm mới!');
  //     }
  // };

  const [citiesData] = useState(cites); // Dữ liệu các thành phố từ cites.json
  const [districtData] = useState(districts); // Dữ liệu quận/huyện từ districtData.json
  const [selectedCity, setSelectedCity] = useState(""); // Thành phố được chọn
  const [availableDistricts, setAvailableDistricts] = useState([]); // Danh sách quận/huyện của thành phố được chọn

  // Thêm ref cho từng trường cần focus khi có lỗi
  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const phoneRef = React.useRef(null);
  const districtRef = React.useRef(null);

  const checkEmailExists = async (email, currentCustomerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://tourwebbe.onrender.com/customers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();

      // Kiểm tra nếu có khách hàng nào có email trùng với email cần kiểm tra, trừ khách hàng hiện tại
      const emailExists = result.result.some(
        (customer) =>
          customer.customerEmail === email &&
          customer.idAsString !== currentCustomerId
      );
      return emailExists; // Trả về true nếu email đã tồn tại, false nếu chưa
    } catch (error) {
      console.error("Error checking email:", error);
      return false; // Nếu có lỗi, trả về false
    }
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer.customerName) {
      nameRef.current.focus(); // Focus vào trường Tên khách hàng
      return message.error(
        "Tên khách hàng không hợp lệ: không được để trống, không chứa số hoặc ký tự đặc biệt."
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(selectedCustomer.customerEmail)) {
      emailRef.current.focus(); // Focus vào trường Email
      return message.error("Email không hợp lệ.");
    }

    const emailExists = await checkEmailExists(
      selectedCustomer.customerEmail,
      selectedCustomer.idAsString
    );
    if (emailExists) {
      emailRef.current.focus();
      return message.error("Email này đã tồn tại trong hệ thống.");
    }

    if (!selectedCustomer.customerPhoneNumber) {
      phoneRef.current.focus(); // Focus vào trường Số điện thoại
      return message.error("Số điện thoại không được bỏ trống.");
    }
    if (!selectedCustomer.customerDistrict) {
      districtRef.current.focus(); // Focus vào trường Quận
      return message.error("Quận/huyện không được bỏ trống.");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://tourwebbe.onrender.com/customers/${selectedCustomer.idAsString}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedCustomer),
        }
      );

      if (response.ok) {
        message.success("Khách hàng đã được cập nhật thành công!");
        fetchData();
        handleDetailModalClose();
      } else throw new Error("Failed to update customer");
    } catch (error) {
      console.error("Error updating customer:", error);
      message.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const searchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        ...(searchParams.customerName && {
          customerName: searchParams.customerName,
        }),
        ...(searchParams.customerEmail && {
          customerEmail: searchParams.customerEmail,
        }),
        ...(searchParams.customerPhoneNumber && {
          customerPhone: searchParams.customerPhoneNumber,
        }),
        limit: 100, // Default limit
      }).toString();

      const response = await fetch(
        `https://tourwebbe.onrender.com/customers/searchCustomer?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch customers.");

      const result = await response.json();
      setData(result.result || []);
      message.success("Tìm kiếm thành công!");
    } catch (error) {
      console.error("Error searching customers:", error);
      message.error("Có lỗi xảy ra khi tìm kiếm khách hàng!");
    }
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Lấy thông tin người dùng
  const isAdmin = userInfo?.roles?.includes("ADMIN"); // Kiểm tra quyền "ADMIN"

  const columns = [
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    { title: "Email", dataIndex: "customerEmail", key: "customerEmail" },
    {
      title: "Số điện thoại",
      dataIndex: "customerPhoneNumber",
      key: "customerPhoneNumber",
    },
    { title: "Thành phố", dataIndex: "customerCity", key: "customerCity" },
    { title: "Quận", dataIndex: "customerDistrict", key: "customerDistrict" },
    { title: "Địa chỉ", dataIndex: "customerAddress", key: "customerAddress" },
    {
        title: 'Hành động',
        key: 'action',
        render: (text, record) => (
            <div className="action-buttons">
                <Button type="link" onClick={() => handleEdit(record)}>
                    <EyeOutlined />
                </Button>
                {isAdmin && ( // Chỉ hiển thị nút xóa nếu người dùng là ADMIN
                    <Button type="link" danger onClick={() => showDeleteConfirm(record.idAsString)}>
                        <DeleteFilled />
                    </Button>
                )}
            </div>
        ),
    },
  ];

  return (
    <div>
      <ul className="searchtable-container">
        <li className="search-container">
          <h6>Tìm kiếm khách hàng</h6>
          <Form className="custom-inline-form-customer" layout="inline">
            <Form.Item>
              <Input
                name="customerName"
                placeholder="Tên khách hàng"
                value={searchParams.customerName}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Input
                name="customerEmail"
                placeholder="Email khách hàng"
                value={searchParams.customerEmail}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Input
                name="customerPhoneNumber"
                placeholder="Số điện thoại khách hàng"
                value={searchParams.customerPhoneNumber}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleReset}>
                Xóa Trắng
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={searchCustomers}>
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>
        </li>
      </ul>

      <div className="table-header">
        <h6>Danh sách khách hàng</h6>
        <div className="table-header-actions">
          {/* <Button type="primary" onClick={handleAdd}>
                        <PlusCircleOutlined />
                    </Button> */}
          <Button onClick={handleReload}>
            <ReloadOutlined />
          </Button>
        </div>
      </div>

      <div className="table-container">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
          }}
        />
      </div>

      {/* Add New Customer Modal */}
      {/* <Modal
                title="Thêm Khách Hàng"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSaveNewCustomer}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên khách hàng">
                        <Input
                            value={newCustomer.customerName}
                            onChange={(e) => handleNewCustomerChange('customerName', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input
                            value={newCustomer.customerEmail}
                            onChange={(e) => handleNewCustomerChange('customerEmail', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Số điện thoại">
                        <Input
                            value={newCustomer.customerPhoneNumber}
                            onChange={(e) => handleNewCustomerChange('customerPhoneNumber', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Thành phố">
                        <Input
                            value={newCustomer.customerCity}
                            onChange={(e) => handleNewCustomerChange('customerCity', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Quận">
                        <Input
                            value={newCustomer.customerDistrict}
                            onChange={(e) => handleNewCustomerChange('customerDistrict', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Địa chỉ">
                        <Input
                            value={newCustomer.customerAddress}
                            onChange={(e) => handleNewCustomerChange('customerAddress', e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal> */}

      {/* Update Customer Modal */}
      <Modal
        title="Chỉnh sửa khách hàng"
        visible={isDetailModalVisible}
        onCancel={handleDetailModalClose}
        onOk={handleUpdateCustomer}
      >
        <Form layout="vertical">
          <Form.Item label="Tên khách hàng">
            <Input
              ref={nameRef}
              value={selectedCustomer?.customerName}
              onChange={(e) =>
                setSelectedCustomer({
                  ...selectedCustomer,
                  customerName: e.target.value,
                })
              }
            />
          </Form.Item>

          <Form.Item label="Email">
            <Input
              ref={emailRef}
              value={selectedCustomer?.customerEmail}
              onChange={(e) =>
                setSelectedCustomer({
                  ...selectedCustomer,
                  customerEmail: e.target.value,
                })
              }
            />
          </Form.Item>

          <Form.Item label="Số điện thoại">
            <Input
              ref={phoneRef}
              value={selectedCustomer?.customerPhoneNumber}
              onChange={(e) =>
                setSelectedCustomer({
                  ...selectedCustomer,
                  customerPhoneNumber: e.target.value,
                })
              }
            />
          </Form.Item>

          <Form.Item label="Thành phố">
            <Select
              value={selectedCustomer?.customerCity}
              onChange={(value) => {
                // Nếu thành phố được chọn khác với thành phố hiện tại, xóa trắng trường "Quận"
                if (value !== selectedCustomer.customerCity) {
                  setSelectedCustomer({
                    ...selectedCustomer,
                    customerCity: value,
                    customerDistrict: "",
                  });
                } else {
                  setSelectedCustomer({
                    ...selectedCustomer,
                    customerCity: value,
                  });
                }

                setSelectedCity(value); // Cập nhật thành phố mới
                setAvailableDistricts(districtData[value] || []); // Cập nhật danh sách quận/huyện mới
              }}
            >
              {citiesData.map((city) => (
                <Select.Option key={city} value={city}>
                  {city}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Quận">
            <Select
              ref={districtRef}
              value={selectedCustomer?.customerDistrict}
              onChange={(value) =>
                setSelectedCustomer({
                  ...selectedCustomer,
                  customerDistrict: value,
                })
              }
            >
              {availableDistricts.map((district) => (
                <Select.Option key={district} value={district}>
                  {district}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Địa chỉ">
            <Input
              value={selectedCustomer?.customerAddress}
              onChange={(e) =>
                setSelectedCustomer({
                  ...selectedCustomer,
                  customerAddress: e.target.value,
                })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SearchTableCustomer;
