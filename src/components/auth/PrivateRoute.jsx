import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../loading/LoadingSpinner";

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
