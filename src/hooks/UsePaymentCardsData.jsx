import { useState, useEffect, useRef, useCallback } from "react";
import { useAlert } from "../context/alertProvider";
import apiFetch from "../utils/apiClient";
import Validator from "../utils/formValidator";

const usePaymentCardsData = (userId) => {
  const [paymentCardsData, setPaymentCardsData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const originalDataRef = useRef([]);
  const isProcessingRef = useRef(false);

  const { showAlert, showConfirm } = useAlert();

  const fetchPaymentCardsData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await apiFetch(`/get_user_cards?user_id=${userId}`);
      if (response.responseCode === 200) {
        const formattedData = response.data.map((card) => ({
          id: card.payment_card_id,
          ...card,
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
  }, [userId, setPaymentCardsData, setLoading]);

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
        prev.map((card) =>
          card.payment_card_id === paymentCardId
            ? { ...card, [field]: value }
            : card
        )
      );
      if (errors[field] !== undefined) {
        validateField(field, value);
      }
    },
    [errors, validateField]
  );

  const deletePaymentCard = useCallback(
    async (paymentCardId) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const response = await apiFetch(
          `/delete_payment_card?payment_card_id=${paymentCardId}`
        );
        if (response.responseCode === 200) {
          const updatedData = paymentCardsData.filter(
            (card) => card.payment_card_id !== paymentCardId
          );
          setPaymentCardsData(updatedData);
          originalDataRef.current = updatedData;
          showAlert("success", "Éxito", "Tarjeta eliminada correctamente.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo eliminar la tarjeta.");
        console.error(error);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [paymentCardsData, setPaymentCardsData]
  );

  const confirmDelete = useCallback(
    (paymentCardId) => {
      showConfirm(
        "¿Eliminar tarjeta?",
        "Esta acción no se puede deshacer.",
        () => {
          deletePaymentCard(paymentCardId);
        }
      );
    },
    [deletePaymentCard]
  );

  const setAsPrimary = useCallback(
    async (paymentCard, newValue) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const payload = {
          payment_card_id: paymentCard.payment_card_id,
          user_id: userId,
          is_principal: newValue ? 1 : 0,
        };

        const response = await apiFetch("/update_payment_card", {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        if (response.responseCode === 200) {
          await fetchPaymentCardsData();
          showAlert(
            "success",
            "Éxito",
            "Tarjeta principal actualizada correctamente."
          );
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo actualizar la tarjeta.");
        console.error(error);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [userId, fetchPaymentCardsData]
  );

  const addPaymentCard = useCallback(
    async (newPaymentCard) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const response = await apiFetch("/create_payment_card", {
          method: "POST",
          body: JSON.stringify(newPaymentCard),
        });

        if (response.responseCode === 201) {
          await fetchPaymentCardsData();
          showAlert("success", "Éxito", "Tarjeta agregada correctamente.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo agregar la tarjeta.");
        console.error(error);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [fetchPaymentCardsData]
  );

  const updatePaymentCard = useCallback(
    async (updatedPaymentCard) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const response = await apiFetch("/update_payment_card", {
          method: "PUT",
          body: JSON.stringify(updatedPaymentCard),
        });

        if (response.responseCode === 200) {
          await fetchPaymentCardsData();
          showAlert("success", "Éxito", "Tarjeta actualizada correctamente.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo actualizar la tarjeta.");
        console.error(error);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [fetchPaymentCardsData]
  );

  return {
    paymentCardsData,
    errors,
    loading,
    handleChange,
    addPaymentCard,
    updatePaymentCard,
    deletePaymentCard: confirmDelete,
    setAsPrimary,
  };
};

export default usePaymentCardsData;
