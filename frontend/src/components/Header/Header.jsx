import React, { useRef, useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./header.css";
//import Tours from "../../pages/Tours"

const Header = () => {
  const headerRef = useRef(null);
  const [navLinks, setNavLinks] = useState([
    {
      path: "/tours/domestic",
      display: "Tour trong nước",
      children: [],
    },
    {
      path: "/tours/international",
      display: "Tour nước ngoài",
      children: [],
    },
    {
      path: "/about",
      display: "Khác",
      children: []
    },
  ]);

  // Hàm lấy danh sách tour từ API
  const fetchTourTypes = async () => {
    try {
      const response = await fetch("http://localhost:8080/typetours");

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      const tours = data.result || [];

      // Lọc các tour trong nước (typeId = 1)
      const domesticTours = tours
        .filter((tour) => tour.typeId === "1")
        .map((tour) => ({
          path: `/tours/by-tourtypename/${tour.name}`, 
          display: tour.name,
        }));

      // Lọc các tour nước ngoài (typeId = 2)
      const internationalTours = tours
        .filter((tour) => tour.typeId === "2")
        .map((tour) => ({
          path: `/tours/by-tourtypename/${tour.name}`, 
          display: tour.name,
        }));

      // Cập nhật navLinks với các tour đã lọc
      setNavLinks((prevLinks) =>
        prevLinks.map((link) => {
          if (link.path === "/tours/domestic") {
            return { ...link, children: domesticTours };
          } else if (link.path === "/tours/international") {
            return { ...link, children: internationalTours };
          }
          return link;
        })
      );
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchTourTypes(); // Gọi API khi component được render
  }, []);

  const stickyHeaderFunc = () => {
    window.addEventListener("scroll", () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  useEffect(() => {
    stickyHeaderFunc();
    return () => window.removeEventListener("scroll", stickyHeaderFunc);
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav_wrapper d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div className="logo">
              <Link to="/home">
                <img src={logo} alt="logo" />
              </Link>
            </div>

            {/* Menu */}
            <div className="navigation">
              <ul className="menu d-flex align-items-center gap-5">
                {navLinks.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__link" : ""
                      }
                    >
                      {item.display}
                    </NavLink>

                    {/* Kiểm tra xem có submenu không */}
                    {item.children && item.children.length > 0 && (
                      <ul className="submenu">
                        {item.children.map((child, childIndex) => (
                          <li key={childIndex}>
                            <NavLink to={child.path}>
                              {child.display}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
