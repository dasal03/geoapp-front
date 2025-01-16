import { useOutletContext } from "react-router-dom";
import usePaymentCardsData from "../../../hooks/UsePaymentCardsData";
import EditableListSection from "../../../components/editableListSection/EditableListSection";

const Cards = () => {
  const { profileData } = useOutletContext();

  const {
    paymentCardsData,
    loading,
    updatePaymentCard,
    addPaymentCard,
    deletePaymentCard,
    handleChange,
    errors,
  } = usePaymentCardsData(profileData?.user_id);

  const handleAddItem = () => {
    addPaymentCard();
  };

  const handleDeleteItem = (id) => {
    deletePaymentCard(id);
  };

  return (
    <div className="profile-section">
      <EditableListSection
        type="payment-cards"
        title="Métodos de pago"
        sectionData={paymentCardsData}
        loading={loading}
        onAddItem={handleAddItem}
        onUpdateItem={updatePaymentCard}
        onDeleteItem={handleDeleteItem}
        errors={errors}
        onChange={handleChange}
      />
    </div>
  );
};

export default Cards;
