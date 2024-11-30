import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Maintenance from "./pages/maintenance/Maintenance";
import EquipmentManagement from "./pages/management/Management";
import Profile from "./pages/profile/Profile";
import About from "./pages/about/About";
import ContactUs from "./pages/contactUs/ContactUs";
import NotFound from "./pages/notFound/NotFound";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/services/maintenance"
      element={
        <PrivateRoute>
          <Maintenance />
        </PrivateRoute>
      }
    />
    <Route
      path="services/management"
      element={
        <PrivateRoute>
          <EquipmentManagement />
        </PrivateRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />
    <Route path="/about" element={<About />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/contact-us" element={<ContactUs />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
