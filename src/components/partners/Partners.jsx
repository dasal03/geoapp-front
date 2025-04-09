import faveroLogo from "../../assets/favero.svg";
import primedicLogo from "../../assets/primedic.svg";
import malvestioLogo from "../../assets/malvestio.svg";
import "./Partners.scss";

const partners = [faveroLogo, primedicLogo, malvestioLogo];

const Partners = () => {
  return (
    <section className="partners">
      <h2>Nuestros Socios</h2>
      <div className="partners-container">
        {partners.map((partner, index) => (
          <img key={index} src={partner} alt="Partner" />
        ))}
      </div>
    </section>
  );
};

export default Partners;
