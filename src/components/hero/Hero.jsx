import React from "react";
import { FaArrowDown } from "react-icons/fa";
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
      <button className="read-more-btn" onClick={onReadMore}>
        Leer más
        <FaArrowDown className="arrow" />
      </button>
    </div>
  </section>
);

export default Hero;
