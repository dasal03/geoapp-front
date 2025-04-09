import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Validator from "../../../../utils/formValidator";
import { usePaymentCardsData } from "../../../../hooks";
import { NoData } from "../../../../components";
import { Button } from "../../../../components/ui";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./PaymentCardsForm.scss";

const SkeletonLoader = () => (
  <div className="card-form-container">
    <div className="skeleton-card" />
    <div className="skeleton-form">
      <div className="skeleton-input full-width" />
      <div className="skeleton-input full-width" />
      <div className="skeleton-row">
        <div className="skeleton-input half-width" />
        <div className="skeleton-input half-width" />
      </div>
      <div className="skeleton-buttons">
        <div className="skeleton-btn" />
        <div className="skeleton-btn" />
      </div>
    </div>
  </div>
);

const initialState = {
  number: "",
  expiry: "",
  cvc: "",
  name: "",
  payment_card_id: null,
  focus: "",
};

const fieldPlaceholders = {
  name: "Nombre en la tarjeta",
  number: "Número de tarjeta",
  expiry: "MM/YY",
  cvc: "CVC",
};

const maxLengths = {
  number: 19,
  expiry: 5,
  cvc: 4,
};

const PaymentCardsForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const paymentCardId = searchParams.get("payment_card_id");

  const { addPaymentCard, updatePaymentCard, paymentCardsData, loading } =
    usePaymentCardsData(userId, paymentCardId, !!paymentCardId);

  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (paymentCardId && paymentCardsData.length > 0) {
      setState((prev) => ({
        ...prev,
        ...paymentCardsData[0],
        cvc: "•••",
        focus: "",
      }));
    }
  }, [paymentCardId, paymentCardsData]);

  const formatInput = useCallback((name, value) => {
    switch (name) {
      case "name":
        return value
          .replace(/[^a-zA-Z\s]/g, "")
          .replace(/\b\w/g, (char) => char.toUpperCase());
      case "number":
        return value
          .replace(/\D/g, "")
          .slice(0, 16)
          .replace(/(\d{4})/g, "$1 ")
          .trim();
      case "expiry": {
        value = value.replace(/\D/g, "").slice(0, 4);
        if (value.length >= 2) {
          let [month, year] = [value.slice(0, 2), value.slice(2, 4)];
          month = Math.max(1, Math.min(12, parseInt(month) || 1))
            .toString()
            .padStart(2, "0");
          return year ? `${month}/${year}` : month;
        }
        return value;
      }
      case "cvc":
        return value.replace(/\D/g, "").slice(0, 4);
      default:
        return value;
    }
  }, []);

  const handleChange = useCallback(
    ({ target: { name, value } }) => {
      const formatted = formatInput(name, value);
      setState((prev) => ({ ...prev, [name]: formatted }));
      setErrors((prev) => ({
        ...prev,
        [name]: value.trim() ? undefined : prev[name],
      }));
    },
    [formatInput]
  );

  const handleFocus = useCallback(({ target: { name } }) => {
    setState((prev) => ({ ...prev, focus: name }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const validator = new Validator(state);
    const validationResults = validator.validateSection([
      { name: "name", required: true, label: "Nombre" },
      { name: "number", required: true, label: "Número de tarjeta" },
      { name: "expiry", required: true, label: "Fecha de expiración" },
      { name: "cvc", required: true, label: "CVC" },
    ]);

    if (!validationResults.isValid) {
      setErrors(validationResults.errors);
      return;
    }

    const original = paymentCardsData[0] || {};
    const payload = {
      user_id: userId,
      payment_card_id: state.payment_card_id,
    };

    for (const key of Object.keys(state)) {
      if (["focus", "id", "payment_card_id"].includes(key)) continue;
      const current =
        key === "number" ? state[key].replace(/\s/g, "") : state[key];
      const originalValue = original[key] || "";
      if (current !== originalValue) {
        payload[key] = current;
      }
    }

    state.payment_card_id
      ? await updatePaymentCard(payload)
      : await addPaymentCard({
          ...payload,
          number: state.number.replace(/\s/g, ""),
        });

    navigate("/profile/payment-cards");
  };

  const formFields = useMemo(() => ["name", "number", "expiry", "cvc"], []);

  if (loading) return <SkeletonLoader />;

  return (
    <div className="card-form-container">
      {paymentCardId && paymentCardsData.length === 0 ? (
        <NoData
          title="Método de pago no encontrado"
          message="No pudimos recuperar la información de este método de pago. Es posible que haya sido eliminado o no esté disponible."
          icon="fas fa-credit-card"
        >
          <Button
            text="Volver"
            icon="fas fa-arrow-left"
            styleType="cancel-btn outlined"
            onClick={() => navigate("/profile/payment-cards")}
          />
        </NoData>
      ) : (
        <>
          <Cards {...state} />
          <form>
            {formFields.map((field) => (
              <div
                key={field}
                className={`field-wrapper ${errors[field] ? "error" : ""}`}
              >
                <input
                  type={field === "cvc" ? "password" : "text"}
                  name={field}
                  placeholder={fieldPlaceholders[field]}
                  value={state[field]}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  maxLength={maxLengths[field]}
                  required
                />
                {errors[field] && (
                  <span className="error-message">{errors[field]}</span>
                )}
              </div>
            ))}

            <div className="buttons">
              <Button
                text={state.payment_card_id ? "Actualizar" : "Guardar"}
                icon="fas fa-save"
                styleType="save-btn"
                onClick={handleSubmit}
              />
              <Button
                text="Cancelar"
                icon="fas fa-times"
                styleType="cancel-btn"
                onClick={() => navigate("/profile/payment-cards")}
              />
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default PaymentCardsForm;
