import React from "react";
import "../styles/about.css";
import travelImg from "../assets/images/travel.jpg"

const About = () => {
  return (
    <div className="about">
      <section className="about__section">
        <div className="container">
          <div className="row">
            <div className="col text-center mb-4 d-flex header-about">
              <h1 className="about__title">Giới thiệu về Travel World</h1>
              <img src={travelImg} alt="" style={{width: "600px", height: "300px"}}/>
            </div>
            <div className="col">
              <p className="about__content">
                <b>Travel World</b> là đơn vị lữ hành chuyên cung cấp các tour du lịch trong nước với nhiều gói khác nhau như tour xuyên Việt, tour trọn gói, tour theo ngày, tour khách hàng tự thiết kế. Ngoài ra, <b>Travel World</b> còn cung cấp các dịch vụ du lịch liên quan như <i>thuê xe</i>, <i>gia hạn visa</i>, <i>vé bus</i>,...
              </p>
              <p className="about__content">
                Tour khởi hành hàng ngày là một trong những tour du lịch được rất nhiều khách hàng quan tâm và lựa chọn. Những tour du lịch hàng ngày sẽ mang tới cho khách hàng sự tiện lợi, không bó buộc vào lịch trình cũng như thời gian khởi hành. Với những ai muốn tận hưởng những trải nghiệm ở các vùng đất mới mà không có quá nhiều thời gian rảnh thì <b>Tour hằng ngày</b> chính là một sự lựa chọn lý tưởng.
              </p>
              <p className="about__content">
                Nếu lựa chọn Tour trọn gói tại <b>Travel World</b>, bạn chỉ việc xách balo lên và đi thôi. Tất cả lịch trình, địa điểm tham quan, nơi lưu trú, giá vé,... sẽ được Travel World lo từ <u>A-Z</u>, đảm bảo mang tới cho du khách những trải nghiệm lý thú nhất.
              </p>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col text-center">
              <h2 className="about__subtitle">Thông tin các chi nhánh</h2>
            </div>
            <div className="col">
              <ul className="about__branches">
                <li><b>Chi nhánh 1:</b> 293, đường Bạch Đằng, phường 15, quận Bình Thạnh, TP. HCM</li>
                <li><b>Chi nhánh 2:</b> 162, đường Nguyễn Văn Công, phường 3, quận Gò Vấp, TP. HCM</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;