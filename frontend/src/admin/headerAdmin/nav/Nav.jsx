import React from 'react'
import './nav.css'
import NavAvatar from './navAvatar/NavAvatar';

function Nav() {
    return (
        <nav className='header-nav ms-auto'>
            <ul className='d-flex align-items-center'>
                <NavAvatar />
            </ul>
        </nav>
    );
}

export default Nav