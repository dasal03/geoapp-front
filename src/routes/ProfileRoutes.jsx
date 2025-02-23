import { Routes, Route } from "react-router-dom";
import Profile from "../pages/profile/Profile";
import PersonalInfo from "../pages/profile/personalInfo/PersonalInfo";
import AccountInfo from "../pages/profile/accountInfo/AccountInfo";
import Security from "../pages/profile/security/Security";
import ChangePassword from "../pages/profile/security/changePassword/ChangePassword";
import PaymentCards from "../pages/profile/paymentCards/PaymentCards";
import PaymentCardsForm from "../pages/profile/paymentCards/PaymentCardsForm";
import Addresses from "../pages/profile/addresses/Addresses";
import AddressesForm from "../pages/profile/addresses/AddressesForm";

const ProfileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Profile />}>
        <Route path="personal-info" element={<PersonalInfo />} />
        <Route path="account-info" element={<AccountInfo />} />
        <Route path="security" element={<Security />}>
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
        <Route path="payment-cards" element={<PaymentCards />} />
        <Route path="payment-cards-form" element={<PaymentCardsForm />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="addresses-form" element={<AddressesForm />} />
      </Route>
    </Routes>
  );
};

export default ProfileRoutes;
