import { useNavigate, useSearchParams } from "react-router-dom";
import { usePaymentCardsData } from "../../../hooks";
import { PaymentCardSection } from "../../../components";

const PaymentCards = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");

  const { loading, paymentCardsData, deletePaymentCard, setAsPrimary } =
    usePaymentCardsData(userId);

  const handleNavigation = (path, params = "") =>
    navigate(`/profile/${path}?user_id=${userId}${params}`);

  return (
    <PaymentCardSection
      title="Medios de pago"
      sectionData={paymentCardsData}
      onCheckChange={setAsPrimary}
      onAddItem={() => handleNavigation("payment-cards-form")}
      onEditItem={(item) =>
        handleNavigation(
          "payment-cards-form",
          `&payment_card_id=${item.payment_card_id}`
        )
      }
      onDeleteItem={deletePaymentCard}
      loading={loading}
    />
  );
};

export default PaymentCards;
