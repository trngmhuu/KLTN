import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import SearchBookingList from "../pages/SearchBookingList";
import TourDetails from "../pages/TourDetails";
import Tours from "../pages/Tours";
import ThankYou from "../pages/ThankYou";
import LoginForm from "../admin/LoginForm/LoginForm";
import AdminHomePage from "../admin/HomePage/HomePage";
import PrivateRoute from "./PrivateRoute";
import DomesticTours from "../pages/DomesticTours";
import InternationalTours from "../pages/InternationalTours";
import ToursOnSale from "../pages/ToursOnSale";
import About from "../pages/About";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/bookings" element={<SearchBookingList />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/admin/login" element={<LoginForm />} />
      <Route path="/tours/by-tourtypename/:tourtypename" element={<Tours />} />
      <Route path="/tours/domestic" element={<DomesticTours />} />
      <Route path="/tours/international" element={<InternationalTours />} />
      <Route path="/tours/on-sale" element={<ToursOnSale />} />
      <Route path="/about" element={<About/>}/>

      {/* Bọc AdminHomePage bằng PrivateRoute */}
      <Route
        path="/admin/home"
        element={
          <PrivateRoute>
            <AdminHomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminHomePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default Router;
