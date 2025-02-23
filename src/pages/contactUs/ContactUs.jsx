import { useEffect } from "react";
import ContactForm from "../../components/contactForm/ContactForm";
import Footer from "../../components/footer/Footer";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./ContactUs.scss";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-us-page">
      <section className="contact-us">
        <div className="container">
          <h1 className="contact-title">Contáctanos</h1>
          <p className="contact-subtitle">
            Estamos aquí para responder a todas tus preguntas y brindarte la
            mejor asistencia.
          </p>

          <div className="contact-info">
            <h2>Información de contacto</h2>
            <p>
              Puedes comunicarte con nosotros a través de los siguientes medios:
            </p>
            <ul>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>
                  <strong>Correo:</strong> contacto@tusitio.com
                </span>
              </li>
              <li>
                <FaPhoneAlt className="contact-icon" />
                <span>
                  <strong>Teléfono:</strong> +1 (123) 456-7890
                </span>
              </li>
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>
                  <strong>Dirección:</strong> Calle Ficticia 123, Ciudad, País
                </span>
              </li>
            </ul>
          </div>

          <div className="contact-form-section">
            <h2>Déjanos tu mensaje</h2>
            <p>
              Completa el siguiente formulario y te responderemos lo antes
              posible.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactUs;
