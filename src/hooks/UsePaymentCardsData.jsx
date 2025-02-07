import { useState, useEffect, useRef } from "react";
import apiFetch from "../utils/apiClient";
import { showAlert } from "../utils/generalTools";
import Validator from "../utils/formValidator";

const usePaymentCardsData = (userId, onSuccess) => {
  const [paymentCardsData, setPaymentCardsData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const originalDataRef = useRef([]);

  useEffect(() => {
    if (!userId) return;
    const fetchPaymentCardsData = async () => {
      setLoading(true);
      try {
        const response = await apiFetch(`/get_user_cards?user_id=${userId}`);
        if (response.responseCode === 200) {
          const formattedData = response.data.map((paymentCard) => ({
            id: paymentCard.payment_card_id,
            ...paymentCard,
          }));
          setPaymentCardsData(formattedData);
          originalDataRef.current = formattedData;
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

  const handleChange = (paymentCardId, field, value) => {
    setPaymentCardsData((prev) =>
      prev.map((paymentCard) =>
        paymentCard.payment_card_id === paymentCardId
          ? { ...paymentCard, [field]: value }
          : paymentCard
      )
    );
    validateField(field, value);
  };

  const validateField = (fieldName, value) => {
    const validator = new Validator({ [fieldName]: value });
    const result = validator.validate(fieldName);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: result.isValid ? undefined : result.message,
    }));
  };

  const getModifiedFields = (paymentCard) => {
    const original = originalDataRef.current.find(
      (orig) => orig.payment_card_id === paymentCard.payment_card_id
    );

    if (!original) return null;

    const modifiedFields = {};
    Object.keys(paymentCard).forEach((key) => {
      if (paymentCard[key] !== original[key] && key !== "bank_name") {
        modifiedFields[key] = paymentCard[key];
      }
    });

    return Object.keys(modifiedFields).length > 0
      ? { payment_card_id: paymentCard.address_id, ...modifiedFields }
      : null;
  };

  const updatePaymentCard = async (paymentCard) => {
    const payload = getModifiedFields(paymentCard);
    if (!payload) return;

    try {
      const response = await apiFetch("/update_payment_card", {
        method: "PUT",
        body: JSON.stringify({ data: [payload] }),
      });
      if (response.responseCode === 200) {
        showAlert("success", "Éxito", "Método de pago actualizado.");
        onSuccess();
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudo actualizar la tarjeta.");
    }
  };

  const setAsPrimary = async (paymentCardId) => {
    if (Array.isArray(paymentCardId)) {
      paymentCardId = paymentCardId[0].payment_card_id;
    }

    const currentPrimary = paymentCardsData.find(
      (paymentCard) => paymentCard.is_principal === 1
    );
    if (currentPrimary?.address_id === paymentCardId) {
      showAlert("info", "Info", "Esta dirección ya es la principal.");
      return;
    }

    const updatedPaymentCards = paymentCardsData
      .filter(
        (paymentCard) =>
          paymentCard.is_principal === 1 ||
          paymentCard.payment_card_id === paymentCardId
      )
      .map(({ id, bank_name, active, ...paymentCard }) => ({
        ...paymentCard,
        user_id: paymentCard.user_id,
        is_principal: paymentCard.payment_card_id === paymentCardId ? 1 : 0,
      }));

    setPaymentCardsData(updatedPaymentCards);

    try {
      const response = await apiFetch("/update_payment_card", {
        method: "PUT",
        body: JSON.stringify(updatedPaymentCards),
      });

      if (response.responseCode === 200) {
        showAlert("success", "Éxito", "Tarjeta principal actualizada.");
      } else {
        showAlert("error", "Error", response.description);
        setPaymentCardsData(paymentCardsData);
      }
    } catch (error) {
      showAlert(
        "error",
        "Error",
        "No se pudo actualizar la tarjeta principal."
      );
      setPaymentCardsData(paymentCardsData);
    }
  };

  const addPaymentCard = async () => {
    try {
      const response = await apiFetch("/create_address", {
        method: "POST",
        body: JSON.stringify(paymentCardsData),
      });

      if (response.responseCode === 201) {
        onSuccess();
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudo añadir el método de pago");
    }
  };

  const deletePaymentCard = async (paymentCardId) => {
    try {
      const response = await apiFetch(
        `/delete_payment_card?payment_card_id=${paymentCardId}`,
        {
          method: "DELETE",
        }
      );

      if (response.responseCode === 200) {
        onSuccess();
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudo eliminar el método de pago");
    }
  };

  return {
    paymentCardsData,
    errors,
    loading,
    handleChange,
    updatePaymentCard,
    setAsPrimary,
    addPaymentCard,
    deletePaymentCard,
  };
};

export default usePaymentCardsData;
