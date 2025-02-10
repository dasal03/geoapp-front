import { useState, useEffect, useRef, useCallback } from "react";
import apiFetch from "../utils/apiClient";
import { showAlert } from "../utils/generalTools";
import Validator from "../utils/formValidator";

const usePaymentCardsData = (userId) => {
  const [paymentCardsData, setPaymentCardsData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const originalDataRef = useRef([]);

  const fetchPaymentCardsData = useCallback(async () => {
    if (!userId) return;
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
        setPaymentCardsData([]);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudieron cargar las tarjetas.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPaymentCardsData();
  }, [fetchPaymentCardsData]);

  const validateField = useCallback((field, value) => {
    const validator = new Validator({ [field]: value });
    const result = validator.validateField(field);
    setErrors((prev) => ({
      ...prev,
      [field]: result.isValid ? undefined : result.message,
    }));
  }, []);

  const handleChange = useCallback(
    (paymentCardId, field, value) => {
      setPaymentCardsData((prev) =>
        prev.map((paymentCard) =>
          paymentCard.payment_card_id === paymentCardId
            ? { ...paymentCard, [field]: value }
            : paymentCard
        )
      );
      if (errors[field] !== undefined) {
        validateField(field, value);
      }
    },
    [errors, validateField]
  );

  const getModifiedFields = useCallback(
    (paymentCard) => {
      const original = originalDataRef.current.find(
        (orig) => orig.payment_card_id === paymentCard.payment_card_id
      );
      if (!original) return null;

      const modifiedFields = Object.fromEntries(
        Object.entries(paymentCard).filter(
          ([key, value]) =>
            value !== original[key] && !["bank_name"].includes(key)
        )
      );

      return Object.keys(modifiedFields).length > 0
        ? {
            payment_card_id: paymentCard.payment_card_id,
            user_id: userId,
            ...modifiedFields,
          }
        : null;
    },
    [userId]
  );

  const sendRequest = useCallback(
    async (
      url,
      options,
      successMessage = null,
      callback,
      shouldRefetch = true
    ) => {
      setLoading(true);
      try {
        const response = await apiFetch(url, options);
        if (response.responseCode === 200 || response.responseCode === 201) {
          if (successMessage) {
            showAlert("success", "Éxito", successMessage, callback);
          }
          if (shouldRefetch) {
            await fetchPaymentCardsData();
          }
        } else {
          showAlert(
            "error",
            "Error",
            response.description || "Ocurrió un error."
          );
        }
      } catch {
        showAlert("error", "Error", "Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    },
    [fetchPaymentCardsData]
  );

  const setAsPrimary = useCallback(
    async (paymentCard, newValue) => {
      const payload = {
        payment_card_id: paymentCard.payment_card_id,
        user_id: userId,
        is_principal: newValue ? 1 : 0,
      };

      await sendRequest(
        "/update_payment_card",
        { method: "PUT", body: JSON.stringify(payload) },
        null,
        true
      );
    },
    [sendRequest, userId]
  );

  const updatePaymentCard = useCallback(
    async (paymentCard, callback) => {
      const payload = getModifiedFields(paymentCard);
      if (!payload) return;
      await sendRequest(
        "/update_payment_card",
        { method: "PUT", body: JSON.stringify(payload) },
        "Tarjeta actualizada exitosamente.",
        callback
      );
    },
    [sendRequest, getModifiedFields]
  );

  const addPaymentCard = useCallback(
    async (newPaymentCard, callback) => {
      await sendRequest(
        "/create_payment_card",
        { method: "POST", body: JSON.stringify(newPaymentCard) },
        "Tarjeta vinculada exitosamente.",
        callback
      );
    },
    [sendRequest]
  );

  const deletePaymentCard = useCallback(
    async (paymentCardId, callback) => {
      await sendRequest(
        `/delete_payment_card?payment_card_id=${
          paymentCardId.payment_card_id || paymentCardId
        }`,
        { method: "DELETE" },
        "Tarjeta desvinculada exitosamente.",
        callback
      );
    },
    [sendRequest]
  );

  return {
    paymentCardsData,
    errors,
    loading,
    handleChange,
    setAsPrimary,
    addPaymentCard,
    updatePaymentCard,
    deletePaymentCard,
  };
};

export default usePaymentCardsData;
