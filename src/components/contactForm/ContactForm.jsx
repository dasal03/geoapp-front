import { useState } from "react";
import InputField from "../ui/inputField/InputField";
import TextAreaField from "../ui/textAreaField/TextAreaField";
import Button from "../ui/button/Button";
import "./ContactForm.scss";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="contact-form">
      <h3>Envíanos tu mensaje</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <InputField
            label="Nombre"
            type="text"
            name="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <InputField
            label="Correo"
            type="email"
            name="email"
            placeholder="Tu correo@email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <TextAreaField
            label="Mensaje"
            id="message"
            name="message"
            placeholder="Escribe tu mensaje aquí..."
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" text="Enviar mensaje" />
      </form>
    </div>
  );
};

export default ContactForm;
