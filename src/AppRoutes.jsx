import { Routes, Route } from "react-router-dom";
import { routes, ServiceRoutes, ProfileRoutes } from "./routes";
import { PrivateRoute } from "./components";
import {
  Home,
  Login,
  Register,
  About,
  PrivacyPolicy,
  ContactUs,
  NotFound,
  Unauthorized,
} from "./pages";

const ADMIN = 1,
  CLIENT = 2;

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

      <Route element={<PrivateRoute allowedRoles={[ADMIN]} />}>
        <Route path={routes.services.maintenance} element={<ServiceRoutes />} />
        <Route path={routes.services.management} element={<ServiceRoutes />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={[ADMIN, CLIENT]} />}>
        <Route path={`${routes.profile.base}/*`} element={<ProfileRoutes />} />
      </Route>

      <Route path={routes.notFound} element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
