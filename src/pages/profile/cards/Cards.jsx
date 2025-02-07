import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import usePaymentCardsData from "../../../hooks/UsePaymentCardsData";
import Loader from "../../../components/ui/loader/Loader";
import EditableListSection from "../../../components/editableListSection/EditableListSection";

const Cards = () => {
  const { profileData } = useOutletContext();

  const {
    paymentCardsData,
    loading,
    updatePaymentCard,
    addPaymentCard,
    deletePaymentCard,
    setAsPrimary,
  } = usePaymentCardsData(profileData?.user_id);

  const [banks, setBanks] = useState([]);

  useEffect(() => {
    if (Array.isArray(paymentCardsData) && paymentCardsData.length > 0) {
      setBanks([{ bank_id: 1, bank_name: "Bancolombia" }]);
    }
  }, [paymentCardsData]);

  if (!profileData?.user_id) {
    return <Loader />;
  }

  const sectionConfig = [
    {
      label: "Banco",
      name: "bank_name",
      type: "select",
      options: banks.map((bank) => ({
        value: bank.bank_id,
        label: bank.bank_name,
      })),
    },
    {
      label: "Número de tarjeta",
      name: "card_number",
      type: "text",
    },
    {
      label: "Fecha de expiración",
      name: "expiration_date",
      type: "date",
    },
  ];

  const formattedPaymentCardData = Array.isArray(paymentCardsData)
    ? paymentCardsData.map((paymentCard) => ({
        ...paymentCard,
        bank_name: paymentCard.bank_name || "",
      }))
    : [];

  return (
    <div className="profile-section">
      <EditableListSection
        title="Métodos de pago"
        sectionData={formattedPaymentCardData}
        sectionConfig={sectionConfig}
        loading={loading}
        onAddItem={addPaymentCard}
        onEditItem={updatePaymentCard}
        onDeleteItem={deletePaymentCard}
        onSetPrimaryItem={setAsPrimary}
      />
    </div>
  );
};

export default Cards;
