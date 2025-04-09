import { useEffect, useState } from "react";
import Card from "../card/Card";
import "./MoreInfo.scss";

const MoreInfo = ({ cards }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("more-info");
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="more-info"
      className={`more-info ${isVisible ? "visible" : ""}`}
    >
      <div className="more-info-container">
        <h2>¿Quiénes somos?</h2>
        <p>
          GeoApp es una empresa comprometida con la innovación en el sector
          biomédico, ofreciendo equipos de última tecnología y un servicio
          postventa inigualable. Con presencia en múltiples países, nos
          especializamos en ofrecer soluciones que mejoran la vida de las
          personas a través de la tecnología.
        </p>
        <div id="cards-section" className="service-cards">
          {cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreInfo;
