import { useNavigate, useOutletContext } from "react-router-dom";
import EditableListSection from "../../../components/editableListSection/EditableListSection";
import Loader from "../../../components/ui/loader/Loader";
import usePaymentCardsData from "../../../hooks/UsePaymentCardsData";

const PaymentCards = () => {
  const navigate = useNavigate();
  const { profileData } = useOutletContext();
  const userId = profileData?.user_id;

  const { loading, paymentCardsData, deletePaymentCard, setAsPrimary } =
    usePaymentCardsData(userId);

  if (loading) return <Loader />;

  const sectionConfig = [
    {
      name: "name",
      label: "Titular de la Tarjeta",
    },
    {
      name: "number",
      label: "Número de Tarjeta",
    },
    {
      name: "expiry",
      label: "Fecha de Vencimiento",
    },
    {
      cvc: "cvc",
      label: "CVC",
      isVisible: false,
    },
  ];

  return (
    <div className="profile-section">
      <EditableListSection
        title="Tarjetas"
        sectionData={paymentCardsData}
        sectionConfig={sectionConfig}
        onCheckChange={setAsPrimary}
        onAddItem={() =>
          navigate(`/profile/payment-cards-form?user_id=${userId}`)
        }
        onEditItem={(item) => {
          navigate(
            `/profile/payment-cards-form?user_id=${userId}&payment_card_id=${item.id}`,
            { state: item }
          );
        }}
        onDeleteItem={deletePaymentCard}
      />
    </div>
  );
};

export default PaymentCards;
