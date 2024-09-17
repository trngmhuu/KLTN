import React from 'react'
import { Container, Row, Button } from "reactstrap"
import { NavLink, Link } from 'react-router-dom'

import logo from "../../assets/images/logo.png"

const nav_links = [
  {
    path: "/home",
    display: "Trang chủ"
  },
  {
    path: "#",
    display: "Về THTravel"
  },
  {
    path: "/tours",
    display: "Tour du lịch"
  }
]

const Header = () => {
  return <header className="header">
    <Container>
      <Row>
        <div className="nav_wrapper d-flex align-items-center justify-content-between">
          {/*======= logo ======= */}
            <div className="logo">
              <img src={logo} alt="" />
            </div>
          {/*======= logo end ======= */}

          {/*======= menu start ======= */}
          <div className="navigation">
            <ul className="menu d-flex align-items-center gap-5">
              {
                nav_links.map((item, index)=> (
                  <li className="nav_item" key={index}>
                    <NavLink to={item.path}>{item.display}</NavLink>
                  </li>
                ))
              }
            </ul>
          </div>
          {/*======= menu end ======= */}
          <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                <Button className="btn secondary__btn"><Link to="/login">Đăng nhập</Link></Button>
                <Button className="btn primary__btn"><Link to="/register">Đăng ký</Link></Button>
              </div>
              <span className="mobile__menu"></span>
          </div>
        </div>
      </Row>
    </Container>
  </header>
}

export default Header
