import React from 'react'
import "../styles/home.css"
import { Container, Row, Col } from 'reactstrap';
import heroImg01 from "../assets/images/hero-img01.jpg"
import heroImg02 from "../assets/images/hero-img02.jpg"
import heroVideo from "../assets/images/hero-video.mp4"
import Subtitle from "./../shared/Subtitle"
import worldImg from "../assets/images/world.png"
import SearchBar from '../shared/SearchBar';

const Home = () => {
  return <>
    {/*======= hero section start =======*/}
    <section>
      <Container>
        <Row>
          <Col lg="6">
            <div className="hero__content">
              <div className="hero__subtitle d-flex align-items-center">
                <Subtitle subtitle={"Cẩm nang du lịch"} />
                <img src={worldImg} alt="" />
              </div>
              <h1>Đi để <span className='highlight'>trải nghiệm</span></h1>
              <p>
                Vì mỗi chuyến hành trình là một câu chuyện, hãy xách balo lên và đi để viết nên câu chuyện của chính bạn ngay hôm nay!
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
              <video src={heroVideo} alt="" controls/>
            </div>
          </Col>
          <Col lg="2">
            <div className="hero__img-box mt-5">
              <img src={heroImg02} alt="" />
            </div>
          </Col>
          <SearchBar/>
        </Row>
      </Container>
    </section>
    {/*======= hero section end =======*/}

    {/*======= =======*/}
    <section>
      <Container>
        <Row>
          <Col lg="3">
            <h5 className='services__subtitle'>Đặt tour ngay hôm nay</h5>
            <h2 className='services__title'>Các loại tour</h2>
          </Col>
        </Row>
      </Container>
    </section>
  </>
}

export default Home
