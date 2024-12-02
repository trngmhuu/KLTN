import { color } from 'echarts';
import React, { useEffect, useState } from 'react';

function NavAvatar() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Lấy dữ liệu userInfo từ localStorage
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            // Parse JSON để lấy dữ liệu người dùng
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    return (
        <div className='nav-item dropdown pe-3'>
            <a
                className='nav-link nav-profile d-flex align-items-center pe-0'
                href='#'
                data-bs-toggle='dropdown'
            >
                {/* Hiển thị tên từ userInfo, mặc định là "Admin" nếu không có userInfo */}
                <span className='d-none d-md-block dropdown-toggle ps-2'>
                    {userInfo ? userInfo.username : 'Admin'}
                </span>
            </a>
            <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile'>
                <li className='dropdown-header'>
                    {/* Hiển thị tên từ userInfo */}
                    <h6>{userInfo ? userInfo.username : 'Admin'}</h6>
                    <span>Hoạt động</span>
                </li>
                <li>
                    <hr className='dropdown-divider' />
                </li>

                <li>
                    <a
                        className='dropdown-item d-flex align-items-center'
                        href='user-profile.html'
                    >
                        <i className='bi bi-person'></i>
                        <span>Thông tin</span>
                    </a>
                </li>
                <li>
                    <hr className='dropdown-divider' />
                </li>

                <li>
                    <a className='dropdown-item d-flex align-items-center'>
                        <i className='bi bi-box-arrow-right'></i>
                        <span>Đăng xuất</span>
                    </a>
                </li>
                <li>
                    <hr className='dropdown-divider' />
                </li>
            </ul>
        </div >
    );
}

export default NavAvatar;
