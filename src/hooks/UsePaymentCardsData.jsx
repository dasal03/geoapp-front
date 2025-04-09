import { useState, useEffect, useCallback } from "react";
import { useAlert } from "../context/alertProvider";
import apiFetch from "../utils/apiClient";

const usePaymentCardsData = (userId, paymentCardId, autoFetch = true) => {
  const [paymentCardsData, setPaymentCardsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showAlert, showConfirm } = useAlert();

  const fetchPaymentCardsData = useCallback(
    async (fetchAll = false) => {
      if (!userId) return;
      setLoading(true);
      try {
        let url = `/get_user_cards?user_id=${userId}`;
        if (!fetchAll && paymentCardId) {
          url += `&payment_card_id=${paymentCardId}`;
        }
        const response = await apiFetch(url);
        if (response.responseCode === 200) {
          const formattedData = response.data.map((card) => ({
            id: card.payment_card_id,
            ...card,
          }));
          setPaymentCardsData(formattedData);
          return formattedData;
        } else if (response.responseCode === 404) {
          setPaymentCardsData([]);
          return [];
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudieron cargar las tarjetas.");
      } finally {
        setLoading(false);
      }
    },
    [userId, paymentCardId, showAlert]
  );

  useEffect(() => {
    if (autoFetch) fetchPaymentCardsData(false);
  }, [fetchPaymentCardsData, autoFetch]);

  const addPaymentCard = useCallback(
    async (newPaymentCard) => {
      setLoading(true);
      try {
        const response = await apiFetch("/create_payment_card", {
          method: "POST",
          body: JSON.stringify(newPaymentCard),
        });
        if (response.responseCode === 201) {
          showAlert("success", "Éxito", "Tarjeta agregada correctamente.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo agregar la tarjeta.");
      } finally {
        setLoading(false);
      }
    },
    [showAlert]
  );

  const updatePaymentCard = useCallback(
    async (updatedPaymentCard) => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await apiFetch("/update_payment_card", {
          method: "PUT",
          body: JSON.stringify(updatedPaymentCard),
        });
        if (response.responseCode === 200) {
          showAlert("success", "Éxito", "Tarjeta actualizada correctamente.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo actualizar la tarjeta.");
      } finally {
        setLoading(false);
      }
    },
    [userId, showAlert]
  );

  const deletePaymentCard = useCallback(
    async (cardId) => {
      setLoading(true);
      try {
        const response = await apiFetch(
          `/delete_payment_card?payment_card_id=${cardId}`,
          { method: "DELETE" }
        );
        if (response.responseCode === 200) {
          setPaymentCardsData((prev) =>
            prev.filter((card) => card.payment_card_id !== cardId)
          );
          showAlert("success", "Éxito", "Tarjeta eliminada correctamente.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo eliminar la tarjeta.");
      } finally {
        setLoading(false);
      }
    },
    [showAlert]
  );

  const confirmDelete = useCallback(
    (cardId) => {
      showConfirm(
        "¿Eliminar tarjeta?",
        "Esta acción no se puede deshacer.",
        () => {
          deletePaymentCard(cardId);
        }
      );
    },
    [deletePaymentCard, showConfirm]
  );

  const setAsPrimary = useCallback(
    async (paymentCard, newValue) => {
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
          setPaymentCardsData((prev) =>
            prev.map((card) => ({
              ...card,
              is_principal:
                card.payment_card_id === paymentCard.payment_card_id
                  ? newValue
                    ? 1
                    : 0
                  : 0,
            }))
          );
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
      }
    },
    [userId, showAlert]
  );

  return {
    paymentCardsData,
    loading,
    fetchPaymentCardsData,
    addPaymentCard,
    updatePaymentCard,
    deletePaymentCard: confirmDelete,
    setAsPrimary,
  };
};

export default usePaymentCardsData;
