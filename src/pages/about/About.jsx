import React from "react";
import Footer from "../../components/footer/Footer";
import "./About.scss";

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-hero">
          <div className="about-hero-overlay"></div>
          <div className="about-hero-text">
            <h1 className="about-title">Acerca de Nosotros</h1>
            <div className="h1-decorator"></div>
            <p className="about-description">
              Conoce nuestra historia, misión y compromiso con la excelencia en
              la tecnología biomédica.
            </p>
          </div>
        </div>
        <div className="about-content">
          <section className="mission-section">
            <h2>Nuestra Misión</h2>
            <p>
              Proveer soluciones innovadoras en el ámbito biomédico a través del
              alquiler, mantenimiento y venta de dispositivos que cumplen con
              los más altos estándares de calidad.
            </p>
          </section>
          <section className="values-section">
            <h2>Nuestros Valores</h2>
            <ul>
              <li>Compromiso con la salud y bienestar.</li>
              <li>Innovación constante.</li>
              <li>Calidad y excelencia en el servicio.</li>
              <li>Integridad en nuestras acciones.</li>
            </ul>
          </section>
          <section className="team-section">
            <h2>Conoce a Nuestro Equipo</h2>
            <div className="team-grid">
              <div className="team-member">
                <img src="/path/to/team-member1.jpg" alt="Miembro 1" />
                <h3>Nombre Apellido</h3>
                <p>Rol del Equipo</p>
              </div>
              <div className="team-member">
                <img src="/path/to/team-member2.jpg" alt="Miembro 2" />
                <h3>Nombre Apellido</h3>
                <p>Rol del Equipo</p>
              </div>
              <div className="team-member">
                <img src="/path/to/team-member3.jpg" alt="Miembro 3" />
                <h3>Nombre Apellido</h3>
                <p>Rol del Equipo</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
