import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import usePaymentCardsData from "../../../hooks/UsePaymentCardsData";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./PaymentCardsForm.scss";

const PaymentCardsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("user_id");
  const paymentCardId = searchParams.get("payment_card_id");

  const { addPaymentCard, updatePaymentCard } = usePaymentCardsData(
    userId,
    paymentCardId
  );

  const initialState = {
    number: location.state?.number ?? "",
    expiry: location.state?.expiry ?? "",
    cvc: location.state?.cvc ?? "",
    name: location.state?.name ?? "",
    payment_card_id: location.state?.payment_card_id ?? null,
  };

  const [state, setState] = useState({ ...initialState, focus: "" });

  const toTitleCase = (str) =>
    str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const handleInputChange = (evt) => {
    let { name, value } = evt.target;

    if (name === "name") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
      value = toTitleCase(value);
    } else if (name === "number") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(\d{4})/g, "$1 ").trim();
    } else if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);

      if (value.length >= 2) {
        let month = value.slice(0, 2);
        let year = value.slice(2, 4);

        if (parseInt(month) < 1 || isNaN(parseInt(month))) month = "01";
        if (parseInt(month) > 12) month = "12";

        value = year ? `${month}/${year}` : month;
      }
    } else if (name === "cvc") {
      value = value.replace(/\D/g, "").slice(0, 4); // Máx 4 dígitos
    }

    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("❌ user_id no encontrado en la URL");
      return;
    }

    const formattedPayload = {
      ...state,
      number: state.number.replace(/\s/g, ""),
      user_id: userId,
    };

    if (initialState.payment_card_id != null) {
      const updatedFields = Object.fromEntries(
        Object.entries(formattedPayload).filter(
          ([key, value]) => key !== "focus" && value !== initialState[key]
        )
      );
      updatePaymentCard({
        user_id: userId,
        payment_card_id: initialState.payment_card_id,
        ...updatedFields,
      });
    } else {
      const { payment_card_id, focus, ...payload } = formattedPayload;
      addPaymentCard(payload);
    }

    navigate("/profile/payment-cards");
  };

  return (
    <div className="card-form-container">
      <Cards
        number={state.number}
        name={state.name}
        expiry={state.expiry}
        cvc={state.cvc}
        focused={state.focus}
      />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre en la tarjeta"
          value={state.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          required
        />
        <input
          type="text"
          name="number"
          placeholder="Número de tarjeta"
          value={state.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          maxLength="19"
          required
        />
        <input
          type="text"
          name="expiry"
          placeholder="MM/YY"
          value={state.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          maxLength="5"
          required
        />
        <input
          type="password"
          name="cvc"
          placeholder="CVC"
          value={state.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          maxLength="4"
          required
        />

        <div className="buttons">
          <button type="submit" className="save-btn">
            Guardar
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/profile/payment-cards")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentCardsForm;
