import React from "react";
import ContactForm from "../components/contactForm/ContactForm";
import Footer from "../components/footer/Footer";
import "../styles/pages/contactUs.scss";

const ContactUs = () => {
  return (
    <div className="contact-us-page">
      <section className="contact-us">
        <div className="container">
          <h1 className="contact-title">Contáctanos</h1>

          <div className="contact-info">
            <h2>¿Tienes alguna pregunta?</h2>
            <p>
              Estamos aquí para ayudarte. Ponte en contacto con nosotros
              utilizando el siguiente formulario o por nuestras vías de
              contacto:
            </p>
            <ul>
              <li>
                <strong>Correo:</strong> contacto@tusitio.com
              </li>
              <li>
                <strong>Teléfono:</strong> +1 (123) 456-7890
              </li>
              <li>
                <strong>Dirección:</strong> Calle Ficticia 123, Ciudad, País
              </li>
            </ul>
          </div>

          <ContactForm />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactUs;
