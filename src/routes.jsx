import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Maintenance from "./pages/maintenance/Maintenance";
import Profile from "./pages/profile/Profile";
import PersonalInfo from "./pages/profile/personalInfo/PersonalInfo";
import AccountInfo from "./pages/profile/accountInfo/AccountInfo";
import Security from "./pages/profile/security/Security";
import ChangePassword from "./pages/profile/security/changePassword/ChangePassword";
import Enable2fa from "./pages/profile/security/enable2fa/Enable2fa";
import PaymentCards from "./pages/profile/paymentCards/PaymentCards";
import Addresses from "./pages/profile/addresses/Addresses";
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
        <PrivateRoute allowedRoles={["admin"]}>
          <Maintenance />
        </PrivateRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <PrivateRoute allowedRoles={["client", "admin"]}>
          <Profile />
        </PrivateRoute>
      }
    >
      <Route path="personal-info" element={<PersonalInfo />} />
      <Route path="account-info" element={<AccountInfo />} />
      <Route path="security" element={<Security />}>
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="enable-2fa" element={<Enable2fa />} />
      </Route>
      <Route path="payment-cards" element={<PaymentCards />} />
      <Route path="addresses" element={<Addresses />} />
    </Route>

    <Route path="/about" element={<About />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/contact-us" element={<ContactUs />} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
