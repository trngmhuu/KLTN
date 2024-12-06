import { Tag, Button, Form, Input, Table, Modal, message } from "antd";
import React, { useState, useEffect } from "react";
import "./searchTableBooking.css";
import "./transition.css";
import {
  DeleteFilled,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useNotifications } from "../../../../context/NotificationContext";

const { confirm } = Modal;

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

function SearchTableBooking({ changeComponent }) {
  const [searchParams, setSearchParams] = useState({
    bookingCode: "",
  });

  const [data, setData] = useState([]);
  const { addNotification } = useNotifications();
  // const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://tourwebbe.onrender.com/bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (Array.isArray(result.result)) {
        setData(result.result); // Cập nhật với danh sách bookings từ `result`
      } else {
        throw new Error("Expected result to be an array");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu từ API.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleReset = () => {
    setSearchParams({
      bookingCode: "",
    });
  };

  const handleReload = () => {
    fetchData();
  };

  const handleEdit = (record) => {
    changeComponent("update", record.bookingCode); // Gọi hàm changeComponent với mã booking
  };

  const handleDelete = async (bookingCode, activeBooking) => {
    if (activeBooking !== "Đã hủy") {
      message.error("Chỉ có thể xóa các booking đã hủy");
      return;
    }

    // Tiến hành xóa nếu booking đã hủy
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://tourwebbe.onrender.com/bookings/${bookingCode}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Lấy tên người dùng từ localStorage
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const username = userInfo?.username || "Người dùng";

        // Thêm thông báo
        addNotification(
          `${username} vừa xóa đơn đặt tour có mã ${bookingCode} đã bị hủy trước đó`
        );
        fetchData(); // Cập nhật lại danh sách sau khi xóa thành công
        message.success("Đặt chỗ đã được xóa thành công"); // Thông báo thành công
      } else {
        throw new Error("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const showDeleteConfirm = (bookingCode, activeBooking) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa Đặt Chỗ này?",
      icon: <ExclamationCircleOutlined />,
      content: `Mã đặt chỗ: ${bookingCode}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDelete(bookingCode, activeBooking); // Truyền thêm activeBooking vào
      },
      onCancel() {
        console.log("Hủy hành động xóa");
      },
    });
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        bookingCode: searchParams.bookingCode,
        limit: 100, // Default limit, adjust as needed
      }).toString();

      const response = await fetch(
        `https://tourwebbe.onrender.com/bookings/search?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (Array.isArray(result.result)) {
        setData(result.result); // Update with search results
      } else {
        throw new Error("Expected result to be an array");
      }
    } catch (error) {
      console.error("Error searching data:", error);
      message.error("Không thể tìm kiếm dữ liệu từ API.");
    }
  };

  const columns = [
    {
      title: "Mã Đặt Chỗ",
      dataIndex: "bookingCode",
      key: "bookingCode",
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    // {
    //     title: 'Email Khách Hàng',
    //     dataIndex: 'customerEmail',
    //     key: 'customerEmail',
    // },
    // {
    //     title: 'Số Điện Thoại',
    //     dataIndex: 'customerPhoneNumber',
    //     key: 'customerPhoneNumber',
    // },
    {
      title: "Số người đi",
      dataIndex: "numberOfCustomer",
      key: "numberOfCustomer",
    },
    {
      title: "Ngày Đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Ngày Dự Kiến",
      dataIndex: "expectedDate",
      key: "expectedDate",
    },
    {
      title: "Tổng Tiền (VNĐ)",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (totalMoney) => formatPrice(totalMoney),
    },
    {
      title: "Thanh Toán",
      key: "payBooking",
      render: (_, { payBooking }) => (
        <Tag color={payBooking ? "green" : "volcano"}>
          {payBooking ? "Đã Thanh Toán" : "Chưa Thanh Toán"}
        </Tag>
      ),
    },
    {
      title: "Trạng Thái",
      key: "activeBooking",
      render: (_, { activeBooking }) => {
        let color, text;

        // Kiểm tra giá trị của activeBooking và gán màu sắc, nội dung tương ứng
        if (activeBooking === "Hoạt động") {
          color = "green"; // Hoạt động
          text = "Hoạt động";
        } else if (activeBooking === "Đang chờ hủy") {
          color = "orange"; // Đang chờ hủy
          text = "Đang chờ hủy";
        } else if (activeBooking === "Đã hủy") {
          color = "volcano"; // Đã hủy
          text = "Đã hủy";
        } else {
          // Giá trị mặc định nếu không phải 3 giá trị trên (nếu có trường hợp khác)
          color = "default";
          text = "Không xác định";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <div className="action-buttons">
          <Button type="link" onClick={() => handleEdit(record)}>
            <EyeOutlined />
          </Button>
          <Button
            type="link"
            danger
            onClick={() =>
              showDeleteConfirm(record.bookingCode, record.activeBooking)
            }
          >
            <DeleteFilled />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <ul className="searchtable-container">
        <li className="search-container">
          <h6>Tìm kiếm Đặt Chỗ</h6>
          <Form className="custom-inline-form-booking" layout="inline">
            <Form.Item>
              <Input
                name="bookingCode"
                placeholder="Mã Đặt Chỗ"
                value={searchParams.bookingCode}
                onChange={handleInputChange}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleReset}>
                Xóa Trắng
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>
        </li>
      </ul>
      <div className="table-header">
        <h6>Bảng Dữ Liệu Đặt Chỗ</h6>
        <div className="table-header-actions">
          <Button
            type="primary"
            onClick={() => changeComponent("add")} // Chuyển sang form thêm Đặt Chỗ
          >
            <PlusCircleOutlined />
          </Button>
          <Button onClick={handleReload}>
            <ReloadOutlined />
          </Button>
        </div>
      </div>

      <TransitionGroup>
        <CSSTransition key="searchTable" timeout={300} classNames="fade">
          <div className="table-container">
            <Table
              columns={columns}
              dataSource={data}
              rowKey="bookingCode"
              pagination={{
                pageSize: 3,
                showSizeChanger: true,
                pageSizeOptions: ["3", "5", "10"],
              }}
            />
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default SearchTableBooking;
