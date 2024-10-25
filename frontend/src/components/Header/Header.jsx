import React, { useRef, useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./header.css";

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
      display: "Giới thiệu",
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
      console.log("Dữ liệu API:", data); // Kiểm tra dữ liệu nhận được

      // Lấy danh sách tour từ `result`
      const tours = data.result || [];

      // Lọc các tour có typeId = "1" (trong nước)
      const domesticTours = tours
        .filter((tour) => tour.typeId === "1")
        .map((tour) => ({
          path: `/search?tour=${tour.typeTourId}`, // Thêm đường dẫn cho menu con
          display: tour.name, // Chỉ cần name làm display
        }));

      // Cập nhật nav_links với các tour trong nước
      setNavLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.path === "/tours/domestic"
            ? { ...link, children: domesticTours }
            : link
        )
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
                              <a>{child.display}</a>
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
