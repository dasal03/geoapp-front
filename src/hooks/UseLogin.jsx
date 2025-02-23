import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useLogin = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formValues.username, formValues.password);
      navigate("/services/management");
    } catch (err) {
      setError("Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    isLoading,
    formValues,
    error,
    handleSubmit,
    handleInputChange,
  };
};

export default useLogin;
