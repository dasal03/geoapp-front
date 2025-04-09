import "./WhatsappButton.scss";
import whatsappIcon from "../../assets/whatsapp-logo.svg";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/573012668858"
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={whatsappIcon} alt="WhatsApp" />
    </a>
  );
};

export default WhatsAppButton;
