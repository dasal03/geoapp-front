import { useEffect, useState } from "react";
import apiFetch from "../../utils/apiClient";
import Validator from "../../utils/formValidator";
import { useAlert } from "../../context/alertProvider";
import { Footer, ContactForm } from "../../components";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./ContactUs.scss";

const ContactUs = () => {
  const { showAlert } = useAlert();
  const [formError, setFormError] = useState({});
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const validator = new Validator(formValues);

  const fields = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      placeholder: "Ingrese su nombre",
      required: true,
    },
    {
      name: "email",
      label: "Correo electrónico",
      type: "email",
      placeholder: "Ingrese su correo",
      required: true,
    },
    {
      name: "message",
      label: "Mensaje",
      type: "textarea",
      placeholder: "Ingrese su mensaje",
      required: true,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (name, e) => {
    const { value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    const fieldValidation = validator.validateField({
      name,
      type: fields.find((f) => f.name === name)?.type || "text",
      required: fields.find((f) => f.name === name)?.required || false,
    });

    setFormError((prev) => ({ ...prev, [name]: fieldValidation.message }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError({});
    const validationResult = validator.validateSection(fields);

    if (!validationResult.isValid) {
      setFormError(validationResult.errors);
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/contact_us", {
        method: "POST",
        body: JSON.stringify(formValues),
      });

      if (response.responseCode === 201) {
        setFormValues({ name: "", email: "", message: "" });
        showAlert("success", "Éxito", "Mensaje enviado exitosamente.");
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      showAlert("error", "Error", "Error al enviar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="contact-form-wrapper">
              <ContactForm
                fields={fields}
                formValues={formValues}
                formError={formError}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactUs;
