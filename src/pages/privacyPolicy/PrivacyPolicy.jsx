import { useEffect } from "react";
import Footer from "../../components/footer/Footer";
import "./PrivacyPolicy.scss";

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-container">
      <div className="privacy-hero">
        <div className="privacy-hero-overlay"></div>
        <div className="privacy-hero-text">
          <h1 className="privacy-title">Política de Privacidad</h1>
          <div className="h1-decorator"></div>
          <p className="privacy-description">
            Tu privacidad es importante para nosotros. Aprende cómo protegemos y
            utilizamos tu información.
          </p>
        </div>
      </div>
      <div className="privacy-content">
        <section>
          <h2>Introducción</h2>
          <p>
            Valoramos tu privacidad y nos comprometemos a proteger tu
            información personal. Aquí explicamos cómo manejamos tus datos.
          </p>
        </section>
        <section>
          <h2>Recopilación de Datos</h2>
          <p>
            Recopilamos la información que compartes al interactuar con nuestro
            sitio, incluyendo:
          </p>
          <ul>
            <li>Nombre, correo electrónico y número de contacto.</li>
            <li>Detalles de navegación en nuestro sitio.</li>
            <li>Información relacionada con transacciones.</li>
          </ul>
        </section>
        <section>
          <h2>Uso de la Información</h2>
          <p>
            Utilizamos tus datos para mejorar tu experiencia y ofrecer servicios
            personalizados, tales como:
          </p>
          <ul>
            <li>Procesar solicitudes y transacciones.</li>
            <li>Optimizar la funcionalidad de nuestro sitio.</li>
            <li>Enviar información relevante sobre productos y servicios.</li>
          </ul>
        </section>
        <section>
          <h2>Tus Derechos</h2>
          <p>Tienes derecho a:</p>
          <ul>
            <li>Acceder y corregir tu información personal.</li>
            <li>Solicitar la eliminación de tus datos.</li>
            <li>Retirar tu consentimiento para el uso de datos.</li>
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
