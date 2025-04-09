import { Footer, WhatsAppButton } from "../../components";
import { FaUsers, FaHistory, FaLightbulb, FaBullseye } from "react-icons/fa";
import "./About.scss";

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-text">
          <h1 className="about-title">Acerca de Nosotros</h1>
          <div className="h1-decorator"></div>
          <p className="about-description">
            Descubre nuestra historia, misión, visión y el equipo que impulsa la
            innovación en tecnología biomédica.
          </p>
        </div>
      </div>

      <div className="about-content">
        <div className="about-grid">
          <section className="about-card">
            <FaBullseye className="about-icon" />
            <h2>Nuestra Misión</h2>
            <p>
              Proveer soluciones innovadoras en el ámbito biomédico a través del
              alquiler, mantenimiento y venta de dispositivos que cumplen con
              los más altos estándares de calidad.
            </p>
          </section>

          <section className="about-card">
            <FaLightbulb className="about-icon" />
            <h2>Nuestra Visión</h2>
            <p>
              Ser líderes en innovación tecnológica biomédica a nivel global,
              creando un impacto positivo en la salud y el bienestar de nuestras
              comunidades.
            </p>
          </section>

          <section className="about-card">
            <FaHistory className="about-icon" />
            <h2>Nuestra Historia</h2>
            <p>
              Fundada hace más de una década, GeoApp ha evolucionado de una
              pequeña startup a una empresa internacional, comprometida con la
              excelencia y la innovación.
            </p>
          </section>

          <section className="about-card">
            <FaUsers className="about-icon" />
            <h2>Nuestro Equipo</h2>
            <p>
              Contamos con profesionales altamente calificados y apasionados por
              la tecnología, que trabajan juntos para transformar el sector
              biomédico.
            </p>
          </section>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default About;
