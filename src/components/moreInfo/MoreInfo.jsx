import ServiceCard from "../serviceCard/ServiceCard";
import "./MoreInfo.scss";

const MoreInfo = ({ cards }) => (
  <section id="more-info" className="more-info">
    <h2>¿Quiénes somos?</h2>
    <p>
      GeoApp es una empresa comprometida con la innovación en el sector
      biomédico, ofreciendo equipos de última tecnología y un servicio postventa
      inigualable. Con presencia en múltiples países, nos especializamos en
      ofrecer soluciones que mejoran la vida de las personas a través de la
      tecnología.
    </p>
    <div id="cards-section" className="service-cards">
      {cards.map((card, index) => (
        <ServiceCard key={index} {...card} />
      ))}
    </div>
  </section>
);

export default MoreInfo;
