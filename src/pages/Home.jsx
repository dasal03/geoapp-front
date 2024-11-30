import React from "react";
import Hero from "../components/hero/Hero";
import MoreInfo from "../components/moreInfo/MoreInfo";
import Footer from "../components/footer/Footer";
import maintenanceImage from "../assets/maintenance.jpg";
import saleImage from "../assets/sale.jpg";
import rentalImage from "../assets/rental.jpg";
import "../styles/pages/home.scss";

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

  const serviceCards = [
    {
      image: rentalImage,
      title: "Alquiler de Equipos",
      description:
        "Ofrecemos equipos médicos en alquiler para adaptarnos a las necesidades temporales de nuestros clientes.",
    },
    {
      image: maintenanceImage,
      title: "Mantenimiento",
      description:
        "Brindamos servicios de mantenimiento preventivo y correctivo de dispositivos biomédicos.",
    },
    {
      image: saleImage,
      title: "Venta de Equipos",
      description:
        "Vendemos equipos biomédicos de última tecnología con garantía y soporte continuo.",
    },
  ];

  return (
    <div className="home-container">
      <Hero onReadMore={handleReadMore} />
      <MoreInfo cards={serviceCards} />
      <Footer />
    </div>
  );
}

export default Home;
