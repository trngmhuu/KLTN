import React from 'react'

function NavAvatar() {
    return (
        <div className='nav-item dropdown pe-3'>
            <a
                className='nav-link nav-profile d-flex align-items-center pe-0'
                href='#'
                data-bs-toggle='dropdown'
            >
                <span className='d-none d-md-block dropdown-toggle ps-2'>Admin</span>
            </a>

            <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile'>
                <li className='dropdown-header'>
                    <h6>Admin</h6>
                    <span>Online</span>
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
                        <span>Profile</span>
                    </a>
                </li>
                <li>
                    <hr className='dropdown-divider' />
                </li>

                <li>
                    <a className='dropdown-item d-flex align-items-center'>
                        <i className='bi bi-box-arrow-right'></i>
                        <span>Logout</span>
                    </a>
                </li>
                <li>
                    <hr className='dropdown-divider' />
                </li>


            </ul>
        </ div>
    )
}

export default NavAvatar