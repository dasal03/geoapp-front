import { useState, useEffect } from "react";
import apiFetch from "../utils/apiClient";
import { showAlert } from "../utils/generalTools";
import Validator from "../utils/formValidator";

const usePaymentCardsData = (userId, onSuccess) => {
  const [paymentCardsData, setPaymentCardsData] = useState({});
  const [modifiedFields, setModifiedFields] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchPaymentCardsData = async () => {
      setLoading(true);
      try {
        const response = await apiFetch(`/get_user_cards?user_id=${userId}`);
        if (response.responseCode === 200) {
          setPaymentCardsData(
            response.data.map((card) => ({
              id: card.payment_card_id,
            }))
          );
        } else if (response.responseCode === 404) {
          setPaymentCardsData({});
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentCardsData();
  }, [userId]);

  const handleChange = (name, value) => {
    setPaymentCardsData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setModifiedFields((prev) => new Set([...prev, name]));
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    const validator = new Validator({ [fieldName]: value });
    const fieldErrors = validator.validate(fieldName);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldErrors[fieldName],
    }));
  };

  const updatePaymentCard = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/update_payment_card", {
        method: "PUT",
        body: JSON.stringify(paymentCardsData),
      });
      if (response.responseCode === 200) {
        onSuccess();
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudo actualizar la tarjeta.");
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentCardsData,
    modifiedFields,
    setModifiedFields,
    errors,
    setErrors,
    loading,
    handleChange,
    updatePaymentCard,
  };
};

export default usePaymentCardsData;
