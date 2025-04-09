import {
  Footer,
  Hero,
  MoreInfo,
  Benefits,
  Blog,
  Location,
  Partners,
  WhatsAppButton,
} from "../../components";
import saleImage from "../../assets/sale.jpg";
import rentalImage from "../../assets/rental.jpg";
import maintenanceImage from "../../assets/maintenance.jpg";
import { useEffect, useState } from "react";
import "./Home.scss";

function HomePage() {
  const [isMoreInfoVisible, setIsMoreInfoVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const moreInfoSection = document.getElementById("more-info");
      if (moreInfoSection) {
        const sectionTop = moreInfoSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.75) {
          setIsMoreInfoVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleReadMore = () => {
    const moreInfoSection = document.getElementById("more-info");
    if (moreInfoSection) {
      moreInfoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const serviceCards = [
    {
      image: rentalImage,
      title: "Alquiler de Equipos",
      description:
        "Ofrecemos equipos médicos en alquiler para adaptarnos a las necesidades temporales de nuestros clientes.",
      link: "/services/rental",
    },
    {
      image: maintenanceImage,
      title: "Mantenimiento",
      description:
        "Brindamos servicios de mantenimiento preventivo y correctivo de dispositivos biomédicos.",
      link: "/services/maintenance",
    },
    {
      image: saleImage,
      title: "Venta de Equipos",
      description:
        "Vendemos equipos biomédicos de última tecnología con garantía y soporte continuo.",
      link: "/services/sale",
    },
  ];

  return (
    <div className="home-container">
      <Hero onReadMore={handleReadMore} />
      <section
        id="more-info"
        className={`more-info-section ${isMoreInfoVisible ? "visible" : ""}`}
      >
        <MoreInfo cards={serviceCards} />
      </section>
      <Benefits />
      <Partners />
      <Blog />
      <Location />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default HomePage;
