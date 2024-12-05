import React, { useState } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/search-booking-list.css";
import Newsletter from "./../shared/Newsletter";
import {
  Container,
  Row,
  Col,
  Modal,
  ModalFooter,
  Button,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import SearchBarBooking from "../shared/SearchBarBooking";
import { useNotifications } from "../context/NotificationContext";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer và toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify

// Hàm định dạng giá tiền với dấu chấm phân cách
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price); // Định dạng theo kiểu Việt Nam
};

const SearchBookingList = () => {
  const { addNotification } = useNotifications();
  const [booking, setBooking] = useState(null); // State để lưu thông tin booking
  const [tour, setTour] = useState(null); // State để lưu thông tin tour
  const [cancellationReason, setCancellationReason] = useState(""); // State để lưu lý do hủy tour

  const calculateDaysDifference = (currentDate, expectedDate) => {
    const [expectedDay, expectedMonth, expectedYear] = expectedDate
      .split("/")
      .map(Number);
    const expected = new Date(expectedYear, expectedMonth - 1, expectedDay);
    const current = new Date();
    return Math.floor((expected - current) / (1000 * 60 * 60 * 24));
  };

  // Callback để nhận thông tin từ SearchBarBooking
  const handleBookingData = async (data) => {
    setBooking(data);
    if (data && data.tourCode) {
      try {
        const response = await fetch(
          `http://localhost:8080/tours/by-tourcode/${data.tourCode}`
        );
        if (!response.ok) {
          throw new Error("Không tìm thấy thông tin tour.");
        }
        const tourData = await response.json();
        setTour(tourData.result); // Lưu thông tin tour
      } catch (err) {
        console.error("Lỗi khi lấy thông tin tour:", err.message);
        setTour(null);
      }
    } else {
      setTour(null);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái modal

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Hàm xử lý khi yêu cầu hủy tour
  const handleCancelRequest = () => {
    // Kiểm tra lý do hủy trước khi mở modal
    if (cancellationReason.trim() === "") {
      toast.error("Vui lòng nhập lý do hủy tour.", {
        position: "top-left",
        autoClose: 3000,
      });
      return;
    }
    toggleModal(); // Mở modal xác nhận
  };

  const confirmCancelRequest = async () => {
    // Thêm thông báo khi người dùng xác nhận hủy tour
    addNotification(
      `Khách hàng ${booking.customerName} vừa yêu cầu hủy tour có mã booking ${booking.bookingCode} với lý do: "${cancellationReason}"`
    );

    try {
      // Gửi PUT request để yêu cầu hủy tour
      const response = await fetch(
        `http://localhost:8080/bookings/pendingcancel/${booking.bookingCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể yêu cầu hủy tour. Vui lòng thử lại.");
      }

      // Lấy lại thông tin booking sau khi đã yêu cầu hủy
      const bookingResponse = await fetch(
        `http://localhost:8080/bookings/by-bookingcode/${booking.bookingCode}`
      );
      const bookingData = await bookingResponse.json();

      if (!bookingResponse.ok) {
        throw new Error("Không thể tải lại thông tin đặt tour.");
      }

      setBooking(bookingData.result); // Cập nhật lại thông tin booking
      setCancellationReason(""); // Xóa lý do hủy

      // Cập nhật thông tin tour tương ứng
      if (bookingData.result && bookingData.result.tourCode) {
        const tourResponse = await fetch(
          `http://localhost:8080/tours/by-tourcode/${bookingData.result.tourCode}`
        );
        const tourData = await tourResponse.json();

        if (!tourResponse.ok) {
          throw new Error("Không tìm thấy thông tin tour.");
        }

        setTour(tourData.result); // Cập nhật lại thông tin tour
      }

      // Đóng modal
      toggleModal();
    } catch (err) {
      console.error("Lỗi khi yêu cầu hủy tour:", err.message);
      toast.error("Đã có lỗi xảy ra khi yêu cầu hủy tour. Vui lòng thử lại.", {
        position: "top-left",
        autoClose: 3000,
      });
    }
  };

  const handlePayment = async () => {
    if (!booking) {
      toast.error("Không tìm thấy thông tin booking.", {
        position: "top-left",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/payment/payment-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingCode: booking.bookingCode,
            totalMoney: booking.totalMoney,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tạo liên kết thanh toán.");
      }

      const data = await response.json();
      toast.success("Đang chuyển hướng đến trang thanh toán...", {
        position: "top-left",
        autoClose: 3000,
      });

      // Chuyển hướng người dùng đến trang thanh toán
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error("Lỗi khi tạo hoặc thực hiện thanh toán:", err.message);
      toast.error(
        "Đã có lỗi xảy ra khi thực hiện thanh toán. Vui lòng thử lại.",
        {
          position: "top-left",
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <>
      <div className="commonSec">
        <CommonSection
          className="commonSec"
          title={"Tra cứu thông tin đặt tour"}
        />
      </div>
      <section>
        <Container>
          <Row>
            {/* Truyền callback handleBookingData xuống SearchBarBooking */}
            <SearchBarBooking onBookingFound={handleBookingData} />
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          <Row>
            {booking ? (
              <Col lg="12" className="booking-details">
                <div className="booking-details-body">
                  <div className="booking-details-content">
                    <div className="header-content">
                      <h2>Thông tin đặt tour</h2>
                    </div>
                    <div className="body-content">
                      <p>
                        <strong>Mã booking:</strong> {booking.bookingCode}
                      </p>
                      <p>
                        <strong>Khách hàng:</strong> {booking.customerName}
                      </p>
                      <p>
                        <strong>Email:</strong> {booking.customerEmail}
                      </p>
                      <p>
                        <strong>Mã tour:</strong> {booking.tourCode}
                      </p>
                      <p>
                        <strong>Ngày đặt:</strong> {booking.bookingDate}
                      </p>
                      <p>
                        <strong>Ngày đi dự kiến:</strong> {booking.expectedDate}
                      </p>
                      <p>
                        <strong>Số người đi:</strong> {booking.numberOfCustomer}
                      </p>
                      <p>
                        <strong>Ghi chú:</strong>{" "}
                        {booking.note && booking.note.trim()
                          ? booking.note
                          : "(Không có)"}
                      </p>
                      <p>
                        <strong>Hình thức thanh toán:</strong> {booking.typePay}
                      </p>
                      <p>
                        <strong>Tổng tiền:</strong>{" "}
                        {formatPrice(booking.totalMoney)} VNĐ
                      </p>
                      <p>
                        <strong>Trạng thái thanh toán:</strong>{" "}
                        <span className="paymentStatus">
                          {booking.payBooking
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </span>
                      </p>
                      <p>
                        <strong>Trạng thái booking:</strong>{" "}
                        <span className="bookingStatus">
                          {booking.activeBooking}
                        </span>
                      </p>
                    </div>
                  </div>
                  {tour ? (
                    <div className="tour-details">
                      <div className="header-content">
                        <h2>Thông tin tour</h2>
                      </div>
                      <div className="image-tour-details">
                        <img src={tour.image} alt="" />
                      </div>
                      <div className="body-content">
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            color: "var(--primary-color)",
                            marginBottom: "10px",
                            fontStyle: "italic",
                          }}
                        >
                          {tour.name}
                        </span>
                        <p>
                          <strong>Loại tour:</strong>{" "}
                          {tour.typeId === "1"
                            ? "Tour trong nước"
                            : tour.typeId === "2"
                            ? "Tour nước ngoài"
                            : "Không xác định"}
                        </p>
                        <p>
                          <strong>Phân loại:</strong> {tour.typeTourName}
                        </p>
                        <p>
                          <strong>Thời gian đi:</strong> {tour.durationTour}
                        </p>
                        <p>
                          <strong>Phương tiện:</strong> {tour.vehicle}
                        </p>
                        <p>
                          <strong>Điểm khởi hành:</strong> {tour.locationStart}
                        </p>
                        <p>
                          <strong>Các ngày khởi hành:</strong>{" "}
                          {tour.startDay.length === 7
                            ? "Hằng ngày"
                            : tour.startDay.join(", ")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p>Đang tải thông tin tour...</p>
                  )}
                </div>
                <div className="booking-details-footer">
                  <div className="payment__section">
                    <button
                      className="btn primary__btn"
                      onClick={handlePayment}
                      disabled={
                        calculateDaysDifference(
                          new Date(),
                          booking.expectedDate
                        ) <= 0 ||
                        booking.payBooking ||
                        booking.activeBooking === "Đã hủy" ||
                        booking.activeBooking === "Đang chờ hủy"
                      }
                    >
                      Thực hiện thanh toán
                    </button>
                  </div>
                  {/* Thêm ô input cho lý do hủy tour */}
                  <div className="cancellation-reason mt-2">
                    <label htmlFor="cancellationReason">
                      <strong>Lý do hủy tour:</strong>
                    </label>
                    <input
                      type="text"
                      id="cancellationReason"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      className="form-control mt-2"
                      placeholder="Nhập lý do hủy tour"
                      disabled={
                        calculateDaysDifference(
                          new Date(),
                          booking.expectedDate
                        ) <= 0 ||
                        booking.activeBooking === "Đang chờ hủy" ||
                        booking.activeBooking === "Đã hủy"
                      }
                    />
                    {/* Hiển thị thông báo phù hợp dựa trên trạng thái */}
                    {
                    calculateDaysDifference(new Date(), booking.expectedDate) <
                      0 ? (
                      <span
                        style={{
                          color: "red",
                          fontWeight: "500",
                          fontSize: "1rem",
                          fontStyle: "italic",
                        }}
                      >
                        (*) Booking này đã quá hạn
                      </span>
                    ) : booking.activeBooking === "Đã hủy" ? (
                      <span
                        style={{
                          color: "red",
                          fontWeight: "500",
                          fontSize: "1rem",
                          fontStyle: "italic",
                        }}
                      >
                        (*) Đã hủy booking này
                      </span>
                    ) : booking.activeBooking === "Đang chờ hủy" ? (
                      <span
                        style={{
                          color: "orange",
                          fontWeight: "500",
                          fontSize: "1rem",
                          fontStyle: "italic",
                        }}
                      >
                        (*) Đang chờ nhân viên xác nhận hủy. Chúng tôi sẽ liên
                        lạc đến bạn trong thời gian sớm nhất!
                      </span>
                    ) : booking.payBooking &&
                      calculateDaysDifference(
                        new Date(),
                        booking.expectedDate
                      ) <= 5 ? (
                      <span
                        style={{
                          color: "red",
                          fontWeight: "500",
                          fontSize: "1rem",
                          fontStyle: "italic",
                        }}
                      >
                        (*) Trong vòng 5 ngày trước ngày đi, chúng tôi sẽ chỉ có
                        thể hoàn lại 80% trên tổng giá trị đã thanh toán nếu quý
                        khách thực hiện hủy tour. Xin lỗi quý khách vì sự bất
                        tiện này!
                      </span>
                    ) : null}
                  </div>
                  <button
                    className="btnCancelTour btn primary__btn mt-2"
                    onClick={handleCancelRequest} // Gọi handleCancelRequest thay vì toggleModal
                    disabled={
                      calculateDaysDifference(
                        new Date(),
                        booking.expectedDate
                      ) <= 0 ||
                      booking.activeBooking === "Đang chờ hủy" ||
                      booking.activeBooking === "Đã hủy"
                    } // Vô hiệu hóa nếu đã thanh toán, đang chờ hủy hoặc đã hủy
                  >
                    Nhập
                  </button>
                </div>
              </Col>
            ) : (
              <Col lg="12">
                <p>
                  Không có thông tin booking nào được tìm thấy. Hãy nhập mã
                  booking để tra cứu.
                </p>
              </Col>
            )}
          </Row>
        </Container>
        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Xác nhận hủy tour</ModalHeader>
          <ModalBody>
            Bạn có chắc chắn muốn yêu cầu hủy tour với mã booking{" "}
            <strong>{booking?.bookingCode}</strong> không?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={confirmCancelRequest}>
              Xác nhận
            </Button>
            <Button color="secondary" onClick={toggleModal}>
              Hủy
            </Button>
          </ModalFooter>
        </Modal>
      </section>
      <Newsletter />
      <ToastContainer />
    </>
  );
};

export default SearchBookingList;
