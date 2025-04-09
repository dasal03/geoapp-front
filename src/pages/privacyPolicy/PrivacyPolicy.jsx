import { useEffect } from "react";
import { Footer } from "../../components";
import "./PrivacyPolicy.scss";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "Introducción",
      content:
        "Valoramos tu privacidad y nos comprometemos a proteger tu información personal. Aquí explicamos cómo manejamos tus datos.",
    },
    {
      title: "Recopilación de Datos",
      content:
        "Recopilamos la información que compartes al interactuar con nuestro sitio, incluyendo:",
      list: [
        "Nombre, correo electrónico y número de contacto.",
        "Detalles de navegación en nuestro sitio.",
        "Información relacionada con transacciones.",
      ],
    },
    {
      title: "Uso de la Información",
      content:
        "Utilizamos tus datos para mejorar tu experiencia y ofrecer servicios personalizados, tales como:",
      list: [
        "Procesar solicitudes y transacciones.",
        "Optimizar la funcionalidad de nuestro sitio.",
        "Enviar información relevante sobre productos y servicios.",
      ],
    },
    {
      title: "Tus Derechos",
      content: "Tienes derecho a:",
      list: [
        "Acceder y corregir tu información personal.",
        "Solicitar la eliminación de tus datos.",
        "Retirar tu consentimiento para el uso de datos.",
      ],
    },
  ];

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
        {sections.map(({ title, content, list }, index) => (
          <section key={index}>
            <h2>{title}</h2>
            <p>{content}</p>
            {list && (
              <ul>
                {list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
