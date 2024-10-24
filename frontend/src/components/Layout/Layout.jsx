import React from 'react'
import Header from "../Header/Header"
import Footer from '../Footer/Footer'
import Routers from '../../router/Routers'
import { useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation(); // Lấy thông tin về route hiện tại

  // Danh sách các route không cần header/footer
  const adminRoutes = ['/admin/login', '/admin/home'];

  // Kiểm tra nếu route hiện tại là admin thì không render Header/Footer
  const isAdminRoute = adminRoutes.includes(location.pathname);

  return <>
    {!isAdminRoute && <Header />}  {/* Không hiển thị Header nếu là admin route */}

    <Routers />  {/* Routers luôn hiển thị */}

    {!isAdminRoute && <Footer />}  {/* Không hiển thị Footer nếu là admin route */}
  </>

}

export default Layout