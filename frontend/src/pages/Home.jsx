import React, { useState, useEffect } from "react";
import "../styles/home.css";
import { Container, Row, Col } from "reactstrap";

import heroImg01 from "../assets/images/hero-img01.jpg";
import heroImg02 from "../assets/images/hero-img02.jpg";
import worldImg from "../assets/images/world.png";
import experienceImg from "../assets/images/du-lich-viet-nam-experience.jpg";

import heroImg03 from "../assets/images/hero-img03.jpg";

import Subtitle from "./../shared/Subtitle";
import SearchBar from "../shared/SearchBar";
import ServiceList from "../services/ServiceList";
import FeaturedTourList from "../components/Featured Tours/FeaturedTourList";
import MasonryImagesGallery from "../components/Image gallery/MasonryImagesGallery";
// import Testimonials from "../components/Testimonial/Testimonials";
import Newsletter from "../shared/Newsletter";
import FeaturedTourListOnSale from "../components/Featured Tours/FeaturedTourListOnSale";

const Home = () => {

  const [toursOnSale, setToursOnSale] = useState([]);
  useEffect(() => {
    const fetchAllTours = async () => {
      try {
        const response = await fetch('http://localhost:8080/tours');
        const data = await response.json();
        const saleTours = data.result.filter(tour => tour.saleTour === true);
        setToursOnSale(saleTours);
      } catch (error) {
        console.error('Error fetching all tours:', error);
      }
    };

    fetchAllTours();
  }, []);

  const [domesticTours, setDomesticTours] = useState([]);
  useEffect(() => {
    const fetchDomesticTours = async () => {
      try {
        const response = await fetch('http://localhost:8080/tours/by-type/1');
        const data = await response.json();
        setDomesticTours(data.result);
      } catch (error) {
        console.error('Error fetching domestic tours:', error);
      }
    };

    fetchDomesticTours();
  }, []);

  const [internationalTours, setInternationalTours] = useState([]);
  useEffect(() => {
    const fetchInternationalTours = async () => {
      try {
        const response = await fetch('http://localhost:8080/tours/by-type/2');
        const data = await response.json();
        setInternationalTours(data.result);
      } catch (error) {
        console.error('Error fetching international tours:', error);
      }
    };

    fetchInternationalTours();
  }, [])

  return (
    <>
      {/*======= hero section start =======*/}
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={"Cẩm nang du lịch"} />
                  <img src={worldImg} alt="" />
                </div>
                <h1>
                  Đi để <span className="highlight">trải nghiệm</span>
                </h1>
                <p>
                  Vì mỗi chuyến hành trình là một câu chuyện, hãy xách balo lên
                  và đi để viết nên câu chuyện của chính bạn ngay hôm nay!
                </p>
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box">
                <img src={heroImg01} alt="" />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box mt-4">
                <img src={heroImg03} alt="" />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box mt-5">
                <img src={heroImg02} alt="" />
              </div>
            </Col>
            <SearchBar />
          </Row>
        </Container>
      </section>
      {/*======= hero section end =======*/}

      {/*======= service section start =======*/}
      <section>
        <Container>
          <Row>
            <Col lg="3">
              <h5 className="services__subtitle">Đặt tour ngay hôm nay</h5>
              <h2 className="services__title">Chúng tôi cung cấp gói tour với</h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>
      {/*======= service section end =======*/}

      {/*======= featured tour section start =======*/}
      <Container>
        <Row>
          <Col lg="12" className="mb-3">
            <Subtitle subtitle={"Ưu đãi đặc biệt"} />
            <div className="featured__tour-title">
              <a href="/tours/on-sale"><h1 className="section__title">TOUR NỔI BẬT</h1></a>
            </div>
          </Col>
          <FeaturedTourListOnSale tours={toursOnSale} />
        </Row>
      </Container>
      {/*======= featured tour section end =======*/}

      {/*======= featured tour section start =======*/}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-3">
              <Subtitle subtitle={"Du Lịch Trong Nước"} />
              <div className="featured__tour-title">
                <a href="/tours/domestic"><h1 className="section__title">Tour trong nước</h1></a>
              </div>
            </Col>
            <FeaturedTourList tours={domesticTours} />
          </Row>
        </Container>
      </section>
      {/*======= featured tour section end =======*/}

      {/*======= featured tour section start =======*/}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-3">
              <Subtitle subtitle={"Du Lịch Nước Ngoài"} />
              <div className="featured__tour-title">
                <a href="/tours/international"><h1 className="section__title">Tour nước ngoài</h1></a>
              </div>
            </Col>
            <FeaturedTourList tours={internationalTours} />
          </Row>
        </Container>
      </section>
      {/*======= featured tour section end =======*/}

      {/*======= experience section start =======*/}
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="experience__content">
                <Subtitle subtitle={"Kinh nghiệm"} />
                <h2>
                  Trên khắp tất cả nền tảng,
                </h2>
                <p style={{ textAlign: "center", fontSize: "1.5rem" }}>
                  Chúng tôi tự hào khi đạt được
                </p>
              </div>
              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>12k+</span>
                  <h6>Tour đặt mỗi tháng</h6>
                </div>
                <div className="counter__box">
                  <span>2k+</span>
                  <h6>Khách hàng lựa chọn</h6>
                </div>
                <div className="counter__box">
                  <span>5</span>
                  <h6>Năm kinh nghiệm</h6>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="experience__img">
                <img src={experienceImg} alt="" style={{ border: "2px solid var(--secondary-color)" }} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/*======= experience section end =======*/}

      {/*======= gallery section start =======*/}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Khoảnh khắc lữ hành"} />
              <h2 className="gallery__title">
                Đem về những bức ảnh, để lại những dấu chân
              </h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>
      {/*======= gallery section end =======*/}

      {/*======= testimonial section start =======*/}
      {/* <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Đánh giá"} />
              <h2 className="testimonial__title">
                Đánh giá tích cực từ người dùng
              </h2>
            </Col>
            <Col lg="12">
              <Testimonials />
            </Col>
          </Row>
        </Container>
      </section> */}
      {/*======= testimonial section end =======*/}
      <Newsletter />
    </>
  );
};

export default Home;
