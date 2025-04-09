import { FaTools, FaClock, FaShieldAlt } from "react-icons/fa";
import "./Benefits.scss";

const benefits = [
  {
    icon: <FaTools />,
    title: "Soporte Técnico 24/7",
    description:
      "Estamos disponibles en todo momento para garantizar el correcto funcionamiento de los equipos.",
  },
  {
    icon: <FaClock />,
    title: "Entrega Rápida",
    description:
      "Realizamos envíos a nivel nacional con tiempos de entrega reducidos.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Equipos Certificados",
    description:
      "Contamos con certificaciones internacionales para asegurar la mejor calidad.",
  },
];

const Benefits = () => {
  return (
    <section className="benefits">
      <h2>¿Por qué elegirnos?</h2>
      <div className="benefits-container">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-card">
            <div className="icon">{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
