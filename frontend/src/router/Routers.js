import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
import SearchResultList from "../pages/SearchResultList";
import TourDetails from "../pages/TourDetails";
import Tours from "../pages/Tours";
import ThankYou from "../pages/ThankYou";
import LoginForm from "../admin/LoginForm/LoginForm"
import AdminHomePage from "../admin/HomePage/HomePage"

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      {/* <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> */}
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/admin/login" element={<LoginForm />} />
      <Route path="/admin/home" element={<AdminHomePage />} />
    </Routes>
  );
};

export default Router;
