import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import apiFetch from "../../../utils/apiClient";
import { showAlert } from "../../../utils/generalTools";
import usePaymentCardsData from "../../../hooks/UsePaymentCardsData";
import EditableListSection from "../../../components/editableListSection/EditableListSection";
import Loader from "../../../components/ui/loader/Loader";

const PaymentCards = () => {
  const { profileData } = useOutletContext();
  const userId = profileData?.user_id;

  const {
    loading,
    paymentCardsData,
    updatePaymentCard,
    addPaymentCard,
    deletePaymentCard,
    setAsPrimary,
  } = usePaymentCardsData(userId);

  const [banks, setBanks] = useState([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await apiFetch("/get_banks");
        if (response.responseCode === 200) {
          setBanks(
            response.data.map(({ bank_id, bank_name }) => ({
              value: bank_id,
              label: bank_name,
            }))
          );
        }
      } catch {
        showAlert("error", "Error", "Error al conectar con el servidor.");
      }
    };
    fetchBanks();
  }, []);

  const sectionConfig = [
    {
      id: "bank_id",
      name: "bank_name",
      label: "Banco",
      type: "select",
      options: banks,
    },
    {
      id: "card_number",
      name: "card_number",
      label: "Número de tarjeta",
      type: "number",
    },
    {
      id: "expiration_date",
      name: "expiration_date",
      label: "Fecha de expiración",
      placeholder: "MM/AA",
      type: "date",
    },
    {
      id: "cvv",
      name: "cvv",
      label: "CVV",
      type: "password",
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="profile-section">
      <EditableListSection
        title="Tarjetas"
        sectionData={paymentCardsData}
        sectionConfig={sectionConfig}
        onCheckChange={setAsPrimary}
        onAddItem={addPaymentCard}
        onEditItem={updatePaymentCard}
        onDeleteItem={deletePaymentCard}
        userId={userId}
      />
    </div>
  );
};

export default PaymentCards;
