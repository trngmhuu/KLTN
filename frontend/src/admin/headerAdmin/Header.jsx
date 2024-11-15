import React from 'react';
import './header.css';
import Logo from './logo/Logo';
import Nav from './nav/Nav';

function Header() {
    return (
        <header id='header' className='header fixed-top d-flex align-items-center' >
            <Logo />
            <div className='header__section d-flex'>
               <span className='bell'><i class="ri-notification-line"></i></span> 
            </div>
            <Nav />
            
        </header>
    )
}

export default Header