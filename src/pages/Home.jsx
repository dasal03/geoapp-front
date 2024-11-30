import React from "react";
import "../styles/pages/home.scss";
import Footer from "../components/footer/Footer";
import { FaArrowDown } from "react-icons/fa";
import maintenanceImage from "../assets/maintenance.jpg";
import saleImage from "../assets/sale.jpg";
import rentalImage from "../assets/rental.jpg";

function Home() {
  const handleReadMore = () => {
    const cardsSection = document.getElementById("cards-section");
    if (cardsSection) {
      window.scrollTo({
        top: cardsSection.offsetTop - 20,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-text">
          <h1 className="hero-title">GeoApp</h1>
          <div className="h1-decorator"></div>
          <p className="hero-description">
            Somos una compañía{"\n"}
            especializada en el alquiler,{"\n"}
            mantenimiento y venta de{"\n"}
            dispositivos biomédicos.
          </p>
          <button className="read-more-btn" onClick={handleReadMore}>
            Leer más
            <FaArrowDown className="arrow" />
          </button>
        </div>
      </section>

      <section id="more-info" className="more-info">
        <h2>¿Quiénes somos?</h2>
        <p>
          GeoApp es una empresa comprometida con la innovación en el sector
          biomédico, ofreciendo equipos de última tecnología y un servicio
          postventa inigualable. Con presencia en múltiples países, nos
          especializamos en ofrecer soluciones que mejoran la vida de las
          personas a través de la tecnología.
        </p>
        <div id="cards-section" className="service-cards">
          <div className="card">
            <img src={rentalImage} alt="Alquiler" />
            <h3>Alquiler de Equipos</h3>
            <p>
              Ofrecemos equipos médicos en alquiler para adaptarnos a las
              necesidades temporales de nuestros clientes.
            </p>
          </div>
          <div className="card">
            <img src={maintenanceImage} alt="Mantenimiento" />
            <h3>Mantenimiento</h3>
            <p>
              Brindamos servicios de mantenimiento preventivo y correctivo de
              dispositivos biomédicos.
            </p>
          </div>
          <div className="card">
            <img src={saleImage} alt="Venta" />
            <h3>Venta de Equipos</h3>
            <p>
              Vendemos equipos biomédicos de última tecnología con garantía y
              soporte continuo.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
