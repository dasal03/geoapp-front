import Button from "../ui/button/Button";
import "./Hero.scss";

const Hero = ({ onReadMore }) => (
  <section className="hero">
    <div className="hero-overlay"></div>
    <div className="hero-text">
      <h1 className="hero-title">GeoApp</h1>
      <div className="h1-decorator"></div>
      <p className="hero-description">
        Somos una compañía{"\n"}
        especializada en el alquiler,{"\n"}
        mantenimiento y venta de{"\n"}
        dispositivos biomédicos.
      </p>
      <Button
        type="button"
        text="Conocenos"
        icon="fas fa-arrow-down"
        onClick={onReadMore}
      />
    </div>
  </section>
);

export default Hero;
