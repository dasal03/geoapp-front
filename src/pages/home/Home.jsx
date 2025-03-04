import Hero from "../../components/hero/Hero";
import Footer from "../../components/footer/Footer";
import MoreInfo from "../../components/moreInfo/MoreInfo";
import saleImage from "../../assets/sale.jpg";
import rentalImage from "../../assets/rental.jpg";
import maintenanceImage from "../../assets/maintenance.jpg";
import "./Home.scss";

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
      <section id="cards-section">
        <MoreInfo cards={serviceCards} />
      </section>
      <Footer />
    </div>
  );
}

export default Home;
