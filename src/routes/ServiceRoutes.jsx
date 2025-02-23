import { Routes, Route } from "react-router-dom";
import Maintenance from "../pages/maintenance/Maintenance";
import Management from "../pages/management/Management";
import routes from "./routes";

const ServiceRoutes = () => {
  return (
    <Routes>
      <Route path={routes.services.maintenance} element={<Maintenance />} />
      <Route path={routes.services.management} element={<Management />} />
    </Routes>
  );
};

export default ServiceRoutes;
