import { Button } from "../ui";
import "./Hero.scss";

const Hero = ({ onReadMore }) => (
  <section className="hero">
    <div className="hero-overlay"></div>
    <div className="hero-text">
      <h1 className="hero-title">GeoApp</h1>
      <div className="h1-decorator"></div>
      <p className="hero-description">
        Líderes en soluciones biomédicas: alquiler, mantenimiento y venta de
        equipos de última tecnología para el sector de la salud. Innovamos para
        mejorar vidas.
      </p>
      <Button
        type="button"
        text="Más información"
        icon="fas fa-arrow-right"
        onClick={onReadMore}
        styleType="hero-button"
      />
    </div>
  </section>
);

export default Hero;
