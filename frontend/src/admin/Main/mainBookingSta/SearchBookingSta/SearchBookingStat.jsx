import React, { useState } from "react";
import { DatePicker, Button, Table, message, Typography } from "antd";
import dayjs from "dayjs";
import * as XLSX from "xlsx"; // Import thư viện XLSX
import { saveAs } from "file-saver"; // Import file-saver để tải file về

const { RangePicker } = DatePicker;
const { Title } = Typography;

function SearchBookingStat() {
  const [dates, setDates] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);

  const onDateChange = (dates) => {
    setDates(dates);
  };

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    if (!dates || dates.length < 2) {
      message.error("Vui lòng chọn khoảng ngày hợp lệ.");
      return;
    }

    const startDate = dates[0].format("DD/MM/YYYY");
    const endDate = dates[1].format("DD/MM/YYYY");

    try {
      setLoading(true);
      const response = await fetch(
        `https://tourwebbe.onrender.com/bookings/filter?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }

      const data = await response.json();
      setBookings(data);
      setTotalBookings(data.length);

      const total = data.reduce((acc, booking) => acc + booking.totalMoney, 0);
      setTotalRevenue(total);

      message.success("Tìm kiếm thành công!");
    } catch (error) {
      console.error("Lỗi khi tìm kiếm bookings:", error);
      message.error("Có lỗi xảy ra khi tìm kiếm bookings.");
    } finally {
      setLoading(false);
    }
  };

  // Chức năng xuất Excel
  const exportToExcel = () => {
    // Kiểm tra nếu không có dữ liệu bookings
    if (bookings.length === 0) {
      message.error("Không có dữ liệu để xuất Excel.");
      return;
    }

    // Tạo tiêu đề là "Từ ngày [startDate] đến ngày [endDate]"
    const headerTitle = `Từ ngày ${dates[0].format(
      "DD/MM/YYYY"
    )} đến ngày ${dates[1].format("DD/MM/YYYY")}`;

    // Tạo mảng dữ liệu cho file Excel
    const dataWithHeader = [
      [headerTitle], // Dòng tiêu đề
      ["Mã Booking", "Tên Khách Hàng", "Ngày Đặt", "Trạng Thái", "Số Tiền"], // Dòng tiêu đề cột
      ...bookings.map((booking) => [
        booking.bookingCode,
        booking.customerName,
        booking.bookingDate,
        booking.activeBooking,
        booking.totalMoney,
      ]),
      [], // Dòng trống
      ["Tổng doanh thu:", "", "", "", totalRevenue], // Dòng tổng doanh thu
    ];
    // Tạo worksheet từ dữ liệu
    const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeader);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Tạo file Excel và tải về
    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { type: "application/octet-stream" });
    saveAs(blob, "bookings.xlsx");
  };

  const columns = [
    { title: "Mã Booking", dataIndex: "bookingCode", key: "bookingCode" },
    { title: "Tên Khách Hàng", dataIndex: "customerName", key: "customerName" },
    { title: "Ngày Đặt", dataIndex: "bookingDate", key: "bookingDate" },
    { title: "Trạng Thái", dataIndex: "activeBooking", key: "activeBooking" },
    {
      title: "Số Tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (text) => text.toLocaleString() + " VND",
    },
  ];

  return (
    <div>
      <Title level={2}>Tìm Kiếm Booking Theo Ngày</Title>

      <RangePicker format="DD/MM/YYYY" onChange={onDateChange} />
      <Button
        type="primary"
        onClick={fetchBookings}
        style={{ marginLeft: "10px" }}
        loading={loading}
      >
        Tìm Kiếm
      </Button>

      <Button
        onClick={exportToExcel}
        style={{ marginLeft: "10px" }}
        type="dashed"
      >
        Xuất Excel
      </Button>

      <div style={{ marginTop: "20px", fontSize: "16px" }}>
        <strong>Tổng số bookings: </strong>
        {totalBookings}
      </div>

      <Table
        dataSource={bookings}
        columns={columns}
        rowKey="id"
        style={{ marginTop: "20px" }}
      />

      <div style={{ marginTop: "20px", fontSize: "16px" }}>
        <strong>Tổng doanh thu: </strong>
        {totalRevenue.toLocaleString()} VND
      </div>
    </div>
  );
}

export default SearchBookingStat;
