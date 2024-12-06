import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../headerAdmin/Header';
import './homePage.css';
import { CircleLoader } from 'react-spinners';
import SideBar from '../SideBar/SideBar';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import MainDashboard from '../Main/mainDashboard/MainDashboard';
import MainUser from '../Main/mainUser/MainUser';
import MainTour from '../Main/mainTour/MainTour';
import MainTourType from '../Main/mainTourType/MainTourType';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import MainBooking from '../Main/mainBooking/MainBooking';
import MainCustomer from '../Main/mainCustomer/MainCustomer';
import MainCoupon from '../Main/mainCoupon/MainCoupon';
import MainApproveTour from '../Main/mainApproveTour/MainApproveTour';
import MainCancelBooking from '../Main/mainCancelBooking/MainCancelBooking';
import MainBookingSta from '../Main/mainBookingSta/MainBookingSta';
import MainCustomerSta from '../Main/mainCustomerSta/MainCustomerSta';
import { message } from 'antd';

function HomePage() {
    const [loading, setLoading] = useState(false);
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const navigate = useNavigate();  // Khai báo useNavigate

    useEffect(() => {
        // Kiểm tra nếu không có token trong localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
        } else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [navigate]);

    // Ánh xạ các component với tên
    const componentsMap = {
        dashboard: <MainDashboard />,
        user: <MainUser />,
        tour: <MainTour />,
        tourtype: <MainTourType />,
        booking: <MainBooking />,
        customer: <MainCustomer />,
        approveTour: <MainApproveTour />,
        cancelBooking: <MainCancelBooking />,
        coupon: <MainCoupon />,
        bookingSta: <MainBookingSta />,
        customerSta: <MainCustomerSta />,
    };

    // Hàm để thay đổi component đang hiển thị
    const changeComponent = (component) => {
        setActiveComponent(component);
    };

    return (
        <div className='homePage'>
            {
                loading ?
                    <div className="loader-container">
                        <CircleLoader color='#33CCFF' loading={loading} size={150} />
                    </div>
                    :
                    <>
                        <Header />
                        <SideBar changeComponent={changeComponent} />
                        <TransitionGroup>
                            <CSSTransition
                                key={activeComponent}
                                timeout={300}
                                classNames="fade"
                            >
                                <div>{componentsMap[activeComponent]}</div>
                            </CSSTransition>
                        </TransitionGroup>
                    </>
            }
        </div>
    );
}

export default HomePage;