import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import About from "./pages/about/About";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy";
import ContactUs from "./pages/contactUs/ContactUs";
import NotFound from "./pages/notFound/NotFound";
import Unauthorized from "./pages/unauthorized/Unauthorized";

import routes from "./routes/routes";
import ServiceRoutes from "./routes/ServiceRoutes";
import ProfileRoutes from "./routes/ProfileRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.login} element={<Login />} />
      <Route path={routes.register} element={<Register />} />
      <Route path={routes.about} element={<About />} />
      <Route path={routes.privacyPolicy} element={<PrivacyPolicy />} />
      <Route path={routes.contactUs} element={<ContactUs />} />
      <Route path={routes.unauthorized} element={<Unauthorized />} />

      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path={routes.services.maintenance} element={<ServiceRoutes />} />
        <Route path={routes.services.management} element={<ServiceRoutes />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["client", "admin"]} />}>
        <Route path={`${routes.profile.base}/*`} element={<ProfileRoutes />} />
      </Route>

      <Route path={routes.notFound} element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
