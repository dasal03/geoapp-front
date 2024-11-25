import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Register from "./components/register/Register";
import Maintenance from "./components/maintenance/Maintenance";
import EquipmentManagement from "./components/management/EquipmentManagement";
import Profile from "./components/profile/Profile";
import Login from "./components/login/Login";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/maintenance"
          element={
              <PrivateRoute>
                <Maintenance />
              </PrivateRoute>
          }
        />
        <Route
          path="/equipment_management"
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
      </Routes>
    </AuthProvider>
  );
}

export default App;
