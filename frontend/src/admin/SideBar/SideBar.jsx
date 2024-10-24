import React, { useEffect, useState } from 'react';
import './sideBar.css';

function SideBar({ changeComponent }) {
    const [userRole, setUserRole] = useState([]);

    // Lấy thông tin user từ localStorage
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) setUserRole(userInfo.roles);  // Lưu mảng roles vào state
        console.log(userInfo); // Debug thông tin user
        console.log(userInfo.roles); // Kiểm tra giá trị roles
    }, []);

    return (
        <aside id='sidebar' className='sidebar'>
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item">
                    <a className="nav-link" onClick={() => changeComponent('dashboard')}>
                        <i className="bi bi-grid"></i>
                        <span>Tổng quan</span>
                    </a>
                </li>

                <li className="nav-item">
                    <a
                        className="nav-link collapsed"
                        data-bs-target="#components-nav"
                        data-bs-toggle="collapse"
                        href="#"
                    >
                        <i className="bi bi-clipboard2-data-fill"></i>
                        <span>Thống Kê</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul
                        id="components-nav"
                        className="nav-content collapse"
                        data-bs-parent="#sidebar-nav"
                    >
                        <li>
                            <a href="#">
                                <i className="bi bi-circle"></i>
                                <span>Doanh thu</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="bi bi-circle"></i>
                                <span>Thống kê</span>
                            </a>
                        </li>
                    </ul>
                </li>

                <li className='nav-heading'>Quản lý</li>

                {/* ADMIN-only: Quản lý người dùng */}
                {userRole.includes('ADMIN') && (
                    <li className="nav-item">
                        <a className="nav-link collapsed" onClick={() => changeComponent('user')}>
                            <i className="bi bi-people-fill"></i>
                            <span>Quản lý người dùng</span>
                        </a>
                    </li>
                )}

                {/* ADMIN-only: Quản lý danh mục Tour */}
                {userRole.includes('ADMIN') && (
                    <li className="nav-item">
                        <a className="nav-link collapsed" onClick={() => changeComponent('tourtype')}>
                            <i className="bi bi-card-list"></i>
                            <span>Quản lý danh mục Tour</span>
                        </a>
                    </li>
                )}

                {/* Hiển thị cho cả ADMIN và EMPLOYEE */}
                <li className="nav-item">
                    <a className="nav-link collapsed" onClick={() => changeComponent('tour')}>
                        <i className="bi bi-airplane-fill"></i>
                        <span>Quản lý Tour</span>
                    </a>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;
